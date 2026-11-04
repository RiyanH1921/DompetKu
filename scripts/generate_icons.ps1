Add-Type -AssemblyName System.Drawing

$densities = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$baseDir = "android\app\src\main\res"

function Draw-WalletIcon([int]$size, [bool]$isRound) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)

    # Background
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 27, 59, 43)) # #1B3B2B
    if ($isRound) {
        $g.FillEllipse($bgBrush, 0, 0, $size, $size)
    } else {
        # Rounded rect
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $radius = [int]($size * 0.22)
        $d = $radius * 2
        $path.AddArc(0, 0, $d, $d, 180, 90)
        $path.AddArc($size - $d, 0, $d, $d, 270, 90)
        $path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
        $path.AddArc(0, $size - $d, $d, $d, 90, 90)
        $path.CloseFigure()
        $g.FillPath($bgBrush, $path)
    }

    # Card peeking out (Mint Green #8EE0B0)
    $mintBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 142, 224, 176))
    $cW = [int]($size * 0.38)
    $cH = [int]($size * 0.14)
    $cX = [int](($size - $cW) / 2)
    $cY = [int]($size * 0.28)
    $g.FillRectangle($mintBrush, $cX, $cY, $cW, $cH)

    # Gold stripe on card (#D4A054)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 212, 160, 84))
    $g.FillRectangle($goldBrush, [int]($cX + ($cW * 0.1)), [int]($cY - ($cH * 0.25)), [int]($cW * 0.8), [int]($cH * 0.3))

    # Wallet Main Body (Warm Ivory #F6F5EE)
    $ivoryBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 246, 245, 238))
    $wW = [int]($size * 0.54)
    $wH = [int]($size * 0.38)
    $wX = [int](($size - $wW) / 2)
    $wY = [int]($size * 0.36)

    $wPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $wR = [int]($size * 0.08)
    $wD = $wR * 2
    $wPath.AddArc($wX, $wY, $wD, $wD, 180, 90)
    $wPath.AddArc($wX + $wW - $wD, $wY, $wD, $wD, 270, 90)
    $wPath.AddArc($wX + $wW - $wD, $wY + $wH - $wD, $wD, $wD, 0, 90)
    $wPath.AddArc($wX, $wY + $wH - $wD, $wD, $wD, 90, 90)
    $wPath.CloseFigure()
    $g.FillPath($ivoryBrush, $wPath)

    # Flap Strap (Deep Green #1B3B2B)
    $fW = [int]($wW * 0.38)
    $fH = [int]($wH * 0.44)
    $fX = [int]($wX + $wW - $fW + ($size * 0.02))
    $fY = [int]($wY + ($wH - $fH) / 2)
    $g.FillRectangle($bgBrush, $fX, $fY, $fW, $fH)

    # Clasp Snap (Gold circle #D4A054)
    $claspSize = [int]($fH * 0.48)
    $claspX = [int]($fX + ($fW * 0.45) - ($claspSize / 2))
    $claspY = [int]($fY + ($fH - $claspSize) / 2)
    $g.FillEllipse($goldBrush, $claspX, $claspY, $claspSize, $claspSize)

    $g.Dispose()
    return $bmp
}

foreach ($entry in $densities.GetEnumerator()) {
    $folder = Join-Path $baseDir $entry.Key
    $size = $entry.Value

    # Normal Icon
    $icon = Draw-WalletIcon $size $false
    $icon.Save((Join-Path $folder "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $icon.Dispose()

    # Round Icon
    $roundIcon = Draw-WalletIcon $size $true
    $roundIcon.Save((Join-Path $folder "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $roundIcon.Dispose()

    Write-Host "Generated icons for $($entry.Key) ($($size)x$($size))"
}

