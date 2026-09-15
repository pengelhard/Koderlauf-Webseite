# Testdomain test.koderlauf.de einrichten (Option B)
#
# Voraussetzung: Vercel CLI eingeloggt (`npx vercel login`)
# und Zugriff auf DNS-Verwaltung von koderlauf.de

$ErrorActionPreference = "Stop"
$TestDomain = "test.koderlauf.de"
$ProdDomain = "koderlauf.de"

Write-Host "=== Koderlauf Testdomain Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Schritt 1 – DNS (beim Domain-Anbieter von koderlauf.de):" -ForegroundColor Yellow
Write-Host "  Typ:   CNAME"
Write-Host "  Name:  test"
Write-Host "  Wert:  cname.vercel-dns.com"
Write-Host ""
Write-Host "Schritt 2 – Domain in Vercel hinzufügen:" -ForegroundColor Yellow
Write-Host "  npx vercel domains add $TestDomain"
Write-Host ""
Write-Host "Schritt 3 – In Vercel Dashboard (Project > Settings > Domains):" -ForegroundColor Yellow
Write-Host "  - $TestDomain  -> Git Branch: main (Entwicklung / Tester)"
Write-Host "  - $ProdDomain  -> Production Branch: production (offizielle Seite)"
Write-Host ""
Write-Host "Schritt 4 – Production Branch in Vercel (Settings > Git):" -ForegroundColor Yellow
Write-Host "  Production Branch auf 'production' setzen (nicht 'main')"
Write-Host "  => main aktualisiert nur test.koderlauf.de"
Write-Host "  => Merge nach production aktualisiert koderlauf.de"
Write-Host ""
Write-Host "Schritt 5 – Umgebungsvariablen in Vercel:" -ForegroundColor Yellow
Write-Host "  Preview:    NEXT_PUBLIC_SITE_URL=https://$TestDomain"
Write-Host "  Production: NEXT_PUBLIC_SITE_URL=https://$ProdDomain"
Write-Host ""

$confirm = Read-Host "DNS-Eintrag ist gesetzt und Vercel CLI eingeloggt? Domain jetzt hinzufügen? (j/n)"
if ($confirm -ne "j") {
  Write-Host "Abgebrochen. DNS + Dashboard-Schritte oben manuell ausführen." -ForegroundColor Gray
  exit 0
}

npx vercel domains add $TestDomain
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Fertig. Branch-Zuweisung und Production Branch bitte im Vercel Dashboard prüfen." -ForegroundColor Green
Write-Host "Test-URL: https://$TestDomain" -ForegroundColor Green
