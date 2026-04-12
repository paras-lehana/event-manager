# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0] - 2026-04-12

### Added
- Initial setup and hosting on Lehana.in platform.
- Publicly accessible via `https://eventops.lehana.in` and `https://eventops.aidhunik.com`.
- Dockerized deployment for production.
- Integrated with RIG Traefik and VPS Traefik forwarder.
- Added version tracking.
- Implemented dual-domain support.

### Technical
- Cloned from `github.com:paras-lehana/event-manager.git`.
- Deployed on `lehana-rig` (home lab).
- Configured Traefik file-provider rules on VPS for public access.
