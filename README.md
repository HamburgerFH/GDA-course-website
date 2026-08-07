# GDA course website

## Passwortschutz

Die veröffentlichte GitHub-Pages-Site verschlüsselt beim CI-Build alle
generierten HTML-Dateien mit StatiCrypt. Das gemeinsame Passwort liegt nur im
GitHub-Actions-Secret `SITE_PASSWORD`. Das feste Salt in `.staticrypt.json`
ermöglicht, dass ein gemerktes Passwort auf allen Unterseiten und über mehrere
Deployments hinweg funktioniert.

Nur die Startseite ist ein Login-Einstieg. Nach erfolgreicher Eingabe wird die
Freigabe automatisch für 30 Tage gespeichert. Unterseiten entschlüsseln sich
danach ohne weitere Abfrage. Ein direkter Unterseitenaufruf ohne gültige
Freigabe wird zur Startseite umgeleitet; dort erscheint das einzige
Passwortformular.

Zum Ändern des Passworts:

```bash
gh secret set SITE_PASSWORD --repo HamburgerFH/GDA-course-website
```

Danach den Publish-Workflow erneut ausführen. Das Passwort darf weder in Git
noch in Workflow-Ausgaben stehen.

Der Schutz ist eine Zugangshürde für eine statische Website, aber kein
serverseitiger Zugriffsschutz. Das Quell-Repository, `search.json` und statische
Dateien wie Bilder bleiben öffentlich. Für vertrauliche Inhalte ist ein Hoster
mit serverseitiger Authentifizierung erforderlich.

## Notizen

1. Ggfs. Code-Teile für SB 04:

    - Apriori Algo: Kapitel 1.6 ff. mit R kurz ansprechen
    - Conjoint-Analyse: Kapitel 2.5 ff. mit R kurz ansprechen
