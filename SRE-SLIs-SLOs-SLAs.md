# SRE: SLI, SLO, SLA for Sports Event Management

## SLI (Service Level Indicator)
- **Availability (Uptime):** Percentage of time the service responds to HTTP requests (status code 200-399).
- **Response Time:** Average and 95th percentile of HTTP request response time.
- **Error Rate:** Percentage of requests resulting in errors (HTTP 5xx/4xx).

## SLO (Service Level Objective)
- **Uptime:** At least 99% per month.
- **Response Time:** 95% of requests should be processed in under 500 ms.
- **Error Rate:** No more than 1% of total requests result in errors.

## SLA (Service Level Agreement)
- We guarantee service availability of at least 99% per month.
- 95% of all requests will be processed in under 500 ms.
- The error rate will not exceed 1% of total requests.

## Metrics for Monitoring
- `process_uptime_seconds` (Prometheus): Node.js process uptime
- `http_request_duration_seconds` (Prometheus): HTTP request response time
- `http_requests_total` (Prometheus): Total number of requests and errors

---

**This document is updated as the project evolves.**

---

## Incident Simulation and Postmortem

### Example Incident:
- **Date and Time:** 2025-06-02 15:00
- **Problem Description:** A sudden increase in 500 errors (Internal Server Error) when accessing /error.
- **User Impact:** Users could not access part of the functionality.

### Detection:
- **How Detected:** Prometheus alert triggered (HighErrorRate).
- **Metrics/Alerts:** http_requests_total{code="500"} > 1 per minute.

### Diagnosis and Resolution:
- **Actions:** Checked server logs, found an error in the /error route.
- **Time to Recovery:** 10 minutes.

### Root Cause:
- Bug in the /error route logic.

### Preventive Measures:
- Added a test for error handling.
- Improved monitoring for 5xx errors.

---

_You can adapt this example to a real incident you simulate during your project defense._
