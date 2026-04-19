// backend/data/errors.js
// NexusGuard RAG Knowledge Base — 28 entries across 9 categories

export const errorDB = [
  // ── DATABASE ──────────────────────────────────────────────
  {
    keywords: ["timeout", "database", "connection", "5432"],
    category: "Database", issue: "Database Connection Timeout",
    fix: "Increase connection timeout settings, optimize slow queries with EXPLAIN ANALYZE, and verify network connectivity between application pods and the database cluster."
  },
  {
    keywords: ["deadlock", "lock wait", "transaction", "locked"],
    category: "Database", issue: "Database Deadlock Detected",
    fix: "Identify and kill the blocking transaction using pg_locks. Review query patterns, add row-level locking hints, and implement retry logic with exponential backoff."
  },
  {
    keywords: ["replication", "replica", "slave", "lag", "primary"],
    category: "Database", issue: "Database Replication Lag",
    fix: "Check network bandwidth between primary and replica. Tune max_wal_senders, reduce write load, or horizontally scale the replica fleet."
  },
  {
    keywords: ["disk full", "no space", "enospc", "storage"],
    category: "Database", issue: "Disk Space Exhausted",
    fix: "Archive old WAL files, vacuum dead tuples, enable pg_partman for table partitioning. Provision additional EBS/PVC storage volume immediately."
  },

  // ── AUTHENTICATION ────────────────────────────────────────
  {
    keywords: ["401", "unauthorized", "token expired", "auth"],
    category: "Authentication", issue: "Authentication Failure",
    fix: "Refresh the session token, validate user credentials against the identity provider, and ensure the Authorization header is correctly formatted (Bearer <token>)."
  },
  {
    keywords: ["403", "forbidden", "permission denied", "access denied"],
    category: "Authorization", issue: "Authorization Permission Denied",
    fix: "Verify IAM role bindings and RBAC policies. Ensure the service account has the required permissions. Check for policy wildcards that may have been removed."
  },
  {
    keywords: ["jwt", "invalid token", "signature", "malformed"],
    category: "Authentication", issue: "JWT Token Invalid",
    fix: "Verify the JWT secret key is consistent across all services. Check token expiry (exp claim) and clock skew between servers. Regenerate signing keys if compromised."
  },
  {
    keywords: ["brute force", "failed login", "multiple attempts", "account locked"],
    category: "Security", issue: "Brute Force Attack Detected",
    fix: "Temporarily block the source IP via WAF rule. Enforce MFA for all accounts. Implement account lockout after 5 failed attempts with exponential cooldown."
  },

  // ── BACKEND / HTTP ────────────────────────────────────────
  {
    keywords: ["500", "server error", "crash", "internal service error"],
    category: "Backend", issue: "Critical Server Crash",
    fix: "Check backend stderr logs immediately. Restart the crashing service pod. Identify uncaught exception handler gaps and add process-level crash recovery."
  },
  {
    keywords: ["502", "bad gateway", "upstream"],
    category: "Network", issue: "502 Bad Gateway",
    fix: "Restart the upstream application server. Verify load balancer health checks pass. Confirm the service is listening on the correct port and returning valid HTTP responses."
  },
  {
    keywords: ["503", "service unavailable", "overloaded", "capacity"],
    category: "Network", issue: "Service Unavailable — Capacity Exceeded",
    fix: "Scale out the service horizontally via Kubernetes HPA. Check for traffic spikes and activate CDN caching. Review rate limiting and shedding policies."
  },
  {
    keywords: ["504", "gateway timeout", "upstream timeout"],
    category: "Network", issue: "Gateway Timeout (504)",
    fix: "Increase Nginx/HAProxy proxy_read_timeout settings. Optimize slow downstream API calls. Add circuit breaker pattern to prevent cascading timeouts."
  },
  {
    keywords: ["429", "too many requests", "rate limit", "throttle"],
    category: "API", issue: "Rate Limit Exceeded",
    fix: "Implement exponential backoff with jitter in the client. Cache repeated API responses. Upgrade API subscription tier or negotiate higher rate limits."
  },

  // ── KUBERNETES / INFRA ────────────────────────────────────
  {
    keywords: ["oomkilled", "oom", "out of memory", "memory limit"],
    category: "Kubernetes", issue: "Container OOMKilled",
    fix: "Increase container memory limits in the Deployment spec. Profile heap usage with pprof or async-profiler. Check for memory leaks in event listeners and object caches."
  },
  {
    keywords: ["crashloopbackoff", "crash loop", "backoff"],
    category: "Kubernetes", issue: "CrashLoopBackOff",
    fix: "Inspect pod logs: kubectl logs --previous <pod>. Verify environment variables, secrets, and ConfigMaps are correctly mounted. Fix the application startup error."
  },
  {
    keywords: ["evicted", "pod eviction", "node pressure", "disk pressure"],
    category: "Kubernetes", issue: "Pod Eviction — Node Pressure",
    fix: "Add resource requests/limits to all pods. Enable Cluster Autoscaler. Review Pod Disruption Budgets. Clean up unused images and volumes to free node disk space."
  },
  {
    keywords: ["imagepullbackoff", "image pull", "registry", "pull error"],
    category: "Kubernetes", issue: "Image Pull Failure",
    fix: "Verify container registry credentials in the imagePullSecret. Confirm the image tag exists in the registry. Check network egress policies blocking registry access."
  },

  // ── PERFORMANCE ───────────────────────────────────────────
  {
    keywords: ["cpu", "high load", "cpu spike", "100%", "throttled"],
    category: "Performance", issue: "CPU Spike Detected",
    fix: "Profile the process to identify the hot path. Scale horizontally via HPA. Set CPU limits in the container spec. Optimize the high-CPU algorithm or add async processing."
  },
  {
    keywords: ["latency", "slow", "p99", "response time", "degraded"],
    category: "Performance", issue: "High API Latency",
    fix: "Enable distributed tracing (Jaeger/Tempo) to identify the bottleneck service. Add a Redis caching layer for frequent database reads. Optimize N+1 query patterns."
  },

  // ── CACHE ─────────────────────────────────────────────────
  {
    keywords: ["redis", "cache miss", "cache", "flush"],
    category: "Cache", issue: "Cache Cluster Failure",
    fix: "Flush and rebuild the Redis cache. Verify Redis cluster health with redis-cli. Increase maxmemory allocation and set an appropriate eviction policy (allkeys-lru)."
  },

  // ── PAYMENT ──────────────────────────────────────────────
  {
    keywords: ["stripe", "payment", "checkout", "billing", "gateway"],
    category: "Payment", issue: "Payment Gateway Failure",
    fix: "Failover to the backup payment processor. Check the Stripe status page for incidents. Verify API key validity and webhook signature integrity."
  },

  // ── SECURITY ─────────────────────────────────────────────
  {
    keywords: ["sql injection", "sqli", "malicious query", "drop table"],
    category: "Security", issue: "SQL Injection Attempt",
    fix: "Block the source IP immediately via WAF. Audit all database query inputs for parameterization. Enable strict input validation and deploy updated WAF rules."
  },
  {
    keywords: ["ddos", "flood", "syn flood", "traffic spike", "botnet"],
    category: "Security", issue: "DDoS Attack Pattern Detected",
    fix: "Activate upstream DDoS scrubbing (Cloudflare/AWS Shield). Rate limit by IP at the load balancer. Enable challenge pages for suspicious traffic patterns."
  },
  {
    keywords: ["ssl", "tls", "certificate", "handshake", "expired cert"],
    category: "Security", issue: "TLS/SSL Certificate Error",
    fix: "Renew the SSL certificate via Let's Encrypt or your CA. Verify the certificate chain is complete. Check that the domain on the cert matches the service hostname."
  },
  {
    keywords: ["dns", "name resolution", "hostname", "nxdomain"],
    category: "Network", issue: "DNS Resolution Failure",
    fix: "Verify DNS A/CNAME records in your registrar. Flush local DNS cache (systemd-resolved). Check CoreDNS logs in Kubernetes and validate nameserver connectivity."
  },

  // ── JAVASCRIPT / APP ──────────────────────────────────────
  {
    keywords: ["undefined", "not a function", "runtime error", "typeerror"],
    category: "JavaScript", issue: "JS Runtime Exception",
    fix: "Check for uninitialized variables and null dereferences. Ensure all function definitions are loaded before invocation. Add optional chaining (?.) for safe property access."
  },
  {
    keywords: ["heap", "memory leak", "gc overhead", "garbage collection"],
    category: "Memory", issue: "Memory Leak Detected",
    fix: "Use heap profiling (node --heap-prof) to identify the leaking object. Remove unremoved event listeners and clear setInterval timers. Check for circular reference patterns."
  },

  // ── UI / CSS ──────────────────────────────────────────────
  {
    keywords: ["css not working", "flex", "layout issue", "alignment", "overflow"],
    category: "CSS", issue: "UI Layout Discrepancy",
    fix: "Inspect display:flex on the parent container. Verify container dimensions and min/max constraints. Use browser DevTools layout panel to identify CSS specificity conflicts."
  },
  {
    keywords: ["cors", "access-control-allow-origin", "header", "preflight"],
    category: "Web Security", issue: "CORS Policy Blocking Request",
    fix: "Configure the cors() middleware to explicitly allow the calling origin. Ensure preflight OPTIONS requests return the correct Access-Control-Allow-Methods headers."
  }
];
