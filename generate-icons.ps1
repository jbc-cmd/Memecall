Add-Type -AssemblyName System.Drawing

$outputDir = "c:\PlatformIO\Projects\Memecall\icons"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$sizes = @(16, 48, 128)

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $s, $s
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    # Rounded background with purple-pink gradient
    $rect = New-Object System.Drawing.Rectangle 0, 0, $s, $s
    $c1 = [System.Drawing.Color]::FromArgb(255, 168, 85, 247)
    $c2 = [System.Drawing.Color]::FromArgb(255, 236, 72, 153)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 45.0
    
    $corner = [Math]::Max(4, [int]($s * 0.22))
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $corner, $corner, 180, 90)
    $path.AddArc($s - $corner, 0, $corner, $corner, 270, 90)
    $path.AddArc($s - $corner, $s - $corner, $corner, $corner, 0, 90)
    $path.AddArc(0, $s - $corner, $corner, $corner, 90, 90)
    $path.CloseFigure()

    $g.FillPath($brush, $path)

    # Eyes
    $eyeSize = [Math]::Max(2, [int]($s * 0.14))
    $eyeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $g.FillEllipse($eyeBrush, [int]($s * 0.28), [int]($s * 0.32), $eyeSize, $eyeSize)
    $g.FillEllipse($eyeBrush, [int]($s * 0.58), [int]($s * 0.32), $eyeSize, $eyeSize)

    # Smile arc
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([Math]::Max(1.5, [float]($s * 0.08)))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawArc($pen, [int]($s * 0.25), [int]($s * 0.42), [int]($s * 0.5), [int]($s * 0.35), 20, 140)

    $filePath = Join-Path $outputDir "icon$s.png"
    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created $filePath"
}
