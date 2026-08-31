param(
  [Parameter(Mandatory = $true)][string]$VideoPath,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [double]$Seconds = 5
)

Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

$player = [System.Windows.Media.MediaPlayer]::new()
$opened = $false
$failure = $null
$player.add_MediaOpened({ $script:opened = $true })
$player.add_MediaFailed({ param($sender, $event) $script:failure = $event.ErrorException })
$player.Open([Uri]$VideoPath)

$timeout = [Diagnostics.Stopwatch]::StartNew()
while (-not $opened -and -not $failure -and $timeout.Elapsed.TotalSeconds -lt 15) {
  [System.Windows.Threading.Dispatcher]::CurrentDispatcher.Invoke([Action]{}, [System.Windows.Threading.DispatcherPriority]::Background)
  Start-Sleep -Milliseconds 50
}
if ($failure) { throw $failure }
if (-not $opened) { throw 'Timed out while opening the video.' }

$player.Position = [TimeSpan]::FromSeconds($Seconds)
$player.Play()
Start-Sleep -Milliseconds 900

$width = 1600
$height = 900
$drawing = [System.Windows.Media.VideoDrawing]::new()
$drawing.Player = $player
$drawing.Rect = [System.Windows.Rect]::new(0, 0, $width, $height)
$visual = [System.Windows.Media.DrawingVisual]::new()
$context = $visual.RenderOpen()
$context.DrawDrawing($drawing)
$context.Close()
$frame = [System.Windows.Media.Imaging.RenderTargetBitmap]::new($width, $height, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
$frame.Render($visual)
$encoder = [System.Windows.Media.Imaging.PngBitmapEncoder]::new()
$encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($frame))
$directory = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $directory)) { New-Item -ItemType Directory -Path $directory -Force | Out-Null }
$stream = [IO.File]::Open($OutputPath, [IO.FileMode]::Create)
$encoder.Save($stream)
$stream.Close()
$player.Stop()
$player.Close()
