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
    keywords: ["cpu", "high load", "cpu spike", "100%", "99%", "threshold", "usage", "throttled"],
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
    keywords: ["stripe", "payment failure", "checkout error", "billing error", "gateway timed out"],
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

  // ── INVISIBLE / SILENT ERRORS [V3 EXPANSION] ───────────────
  {
    keywords: ["white screen", "blank page", "mount", "react error boundary"],
    category: "UI/React", issue: "React White Screen of Death (WSOD)",
    fix: "Check for minified React errors caused by unhandled exceptions in useEffect or lifecycle hooks. Wrap the top-level app in an ErrorBoundary and check the browser console for ChunkLoadError or syntax errors in the main bundle."
  },
  {
    keywords: ["silent fail", "no response", "stalled", "process lock"],
    category: "System", issue: "Silent Process Lockup (Deadlock)",
    fix: "The process is alive but not handling I/O. Check for CPU spinning or infinite loops. Use SIGUSR1 to trigger a heap dump and inspect thread stalls in the event loop."
  },
  {
    keywords: ["zombie", "orphan process", "defunct"],
    category: "OS", issue: "Zombie Process Accumulation",
    fix: "Parent process failed to wait() on children. Re-parent the processes or restart the container to clear the process table. Verify that the init system (like tini) is properly handling signals."
  },

  // ── CLOUD & ENTERPRISE [V3 EXPANSION] ──────────────────────
  {
    keywords: ["node drain", "preempted", "spot instance", "termination"],
    category: "Cloud/AWS", issue: "Preemptive Node Termination",
    fix: "Cloud provider reclaimed the spot instance. Ensure your application handles SIGTERM for graceful shutdown. Check the cluster autoscaler logs to verify if replacement nodes are provisioned."
  },
  {
    keywords: ["ingress", "path not found", "404", "routing", "alb"],
    category: "Networking", issue: "Ingress Routing Failure",
    fix: "The Ingress controller cannot find a matching path for the host. Verify the Ingress rule host match and service backend port consistency. Check if the deployment labels match the service selector."
  },
  {
    keywords: ["helm", "rollback", "upgrade failed", "chart error"],
    category: "DevOps", issue: "Helm Deployment Collision",
    fix: "Previous deployment is in a failed state and locking the chart. Run 'helm rollback' and prune orphan resources. Check for configuration schema mismatches (values.yaml vs template)."
  },

  // ── FINTECH & API [V3 EXPANSION] ──────────────────────────
  {
    keywords: ["signature mismatch", "webhook verify", "invalid signature"],
    category: "FinTech/Security", issue: "Webhook Signature Integrity Failure",
    fix: "The incoming webhook's cryptographic signature does not match your local secret. Ensure the WEBHOOK_SECRET is correctly synced between Stripe/PayPal and your server environment."
  },
  {
    keywords: ["pci compliance", "encryption", "cipher", "tls 1.2"],
    category: "Security", issue: "Deprecated Encryption Protocol Detected",
    fix: "Your system is attempting to use TLS 1.0/1.1 or a weak cipher suite. Force TLS 1.2+ in your server config (e.g. Nginx ssl_protocols). Update your crypto libraries to meet modern PCI-DSS standards."
  },

  // ── DATABASE & SCALE [V3 EXPANSION] ───────────────────────
  {
    keywords: ["too many clients", "max_connections", "pool exhausted"],
    category: "Scale", issue: "Database Connection Pool Exhaustion",
    fix: "The application has exceeded the maximum allowed connections to the database. Implement a connection pooler like PgBouncer. Increase the database server's max_connections setting and audit for unclosed client connections."
  },
  {
    keywords: ["partition", "index", "bloat", "maintenance"],
    category: "Database", issue: "Query Performance Degraded (Index Bloat)",
    fix: "Table statistics are stale or indices are bloated. Run REINDEX or VACUUM ANALYZE. Archive historical data to cold storage to reduce the primary table scan time."
  },
  // ── CLOUD INFRA & PERMISSIONS [V3+ EXPANSION] ─────────────
  {
    keywords: ["s3", "403", "access denied", "bucket", "policy"],
    category: "Cloud/AWS", issue: "S3 Bucket Access Denied (IAM/ACL)",
    fix: "Verify if the IAM User/Role has 's3:GetObject' permissions. Check the S3 Bucket Policy for explicit Deny statements. Ensure Block Public Access (BPA) is not interfering with cross-account requests."
  },
  {
    keywords: ["lambda", "iam", "permission", "not authorized", "sts"],
    category: "Cloud/AWS", issue: "Lambda Execution Role Missing Permissions",
    fix: "The Lambda function lacks the required 'Action' in its Execution Role. Update the IAM Policy to include the specific service permission (e.g. 'dynamodb:PutItem'). Check for SCPs in AWS Organizations."
  },
  {
    keywords: ["gcp", "quota exceeded", "limit", "resource exhausted"],
    category: "Cloud/GCP", issue: "GCP Project Quota Exhausted",
    fix: "Your project has hit a regional or global quota limit (e.g. CPUs, Static IPs). Request a quota increase via GCP Console or migrate resources to a different region with higher availability."
  },

  // ── MODERN WEB & FRAMEWORKS [V3+ EXPANSION] ───────────────
  {
    keywords: ["hydration", "react", "mismatch", "server-side", "client"],
    category: "Web Framework", issue: "Next.js Hydration Mismatch",
    fix: "The HTML rendered on the server differs from the client-side initial render. Ensure that dynamic data like Dates or Math.random() are only accessed inside useEffect or use suppressHydrationWarning if necessary."
  },
  {
    keywords: ["hmr", "vite", "websocket", "hot reload", "failed"],
    category: "Dev Tools", issue: "Vite HMR Connection Failure",
    fix: "The browser cannot connect to the Vite dev server via WebSocket. Check if you are behind a proxy that isn't forwarding WS traffic. Ensure the 'server.hmr.port' is not blocked by a local firewall."
  },

  // ── SAAS & EXTERNAL APIS [V3+ EXPANSION] ──────────────────
  {
    keywords: ["cloudflare", "522", "origin timeout", "connection"],
    category: "SaaS/CDNs", issue: "Cloudflare 522 Connection Timeout",
    fix: "Cloudflare cannot establish a TCP connection to your origin server. Verify that your origin IP is correct in DNS settings and that your server's firewall (iptables/ufw) allows Cloudflare's IP ranges."
  },
  {
    keywords: ["vercel", "504", "function timeout", "lambda timeout"],
    category: "SaaS/Vercel", issue: "Vercel Serverless Function Timeout",
    fix: "The Vercel function exceeded the execution limit (usually 10s-60s depending on plan). Optimize the function logic, use streaming responses, or move heavy tasks to a background worker engine."
  },
  {
    keywords: ["oauth", "invalid_state", "handshake", "callback"],
    category: "Auth/API", issue: "OAuth2 Handshake State Mismatch",
    fix: "The 'state' parameter returned by the OAuth provider does not match the one stored in your session. This could be a CSRF attempt or a session timeout. Ensure session cookies are correctly set with SameSite=Lax."
  },

  // ── CONTAINER NETWORKING [V3+ EXPANSION] ──────────────────
  {
    keywords: ["subnet", "ip collision", "bridge", "docker", "cni"],
    category: "Infrastructure", issue: "Docker/CNI Subnet Collision",
    fix: "The Docker bridge subnet overlaps with your local network or a VPC CIDR. Modify the 'bip' in /etc/docker/daemon.json to a non-conflicting private IP range."
  },
  {
    keywords: ["cni", "kubelet", "network plugin", "not ready"],
    category: "Kubernetes", issue: "CNI Plugin Not Ready",
    fix: "The Kubelet reports 'NetworkReady=false'. Ensure the CNI (Calico/Flannel/Cilium) pods are running and have the correct permissions. Check /etc/cni/net.d/ for valid configuration files."
  },

  // ── ADVANCED DATA SYSTEMS [V3+ EXPANSION] ─────────────────
  {
    keywords: ["elasticsearch", "circuit breaker", "heap", "parent"],
    category: "Database/ES", issue: "Elasticsearch Circuit Breaker Triggered",
    fix: "The JVM heap usage exceeded the node limit, and ES stopped executing requests to prevent OOM. Increase the heap size (ES_JAVA_OPTS) or optimize the aggregation query to use less memory."
  },
  {
    keywords: ["rabbitmq", "watermark", "memory", "blocked"],
    category: "Messaging", issue: "RabbitMQ Memory High Watermark Blocked",
    fix: "RabbitMQ has paused all producers because memory usage is too high. Increase the RAM allocation or enable paging to disk. Consume messages from the queue faster to reduce the backlog."
  },
  {
    keywords: ["kafka", "under-replicated", "partition", "isr"],
    category: "Messaging/Kafka", issue: "Kafka Under-Replicated Partitions",
    fix: "One or more Kafka brokers are offline or struggling to sync. Check broker logs for disk errors or network partitioning. Increase 'replication.factor' if data durability is a concern."
  },

  // ── ENTERPRISE & ADMISSION [V3+ EXPANSION] ────────────────
  {
    keywords: ["webhook", "replay", "signature", "already processed"],
    category: "SaaS/Security", issue: "Stripe Webhook Replay Attack Detection",
    fix: "An incoming webhook was detected with an old timestamp or a signature that was already processed. Implement idempotency keys in your database to prevent duplicate processing of the same event."
  },
  {
    keywords: ["openshift", "route", "admission", "rejected"],
    category: "Platform", issue: "OpenShift Route Admission Rejected",
    fix: "The OpenShift router rejected the route because the hostname is already in use or the certificate is invalid. Check 'oc get route -o yaml' for the 'status' field details."
  },
  // ── UNIVERSAL TECH FAILURES [V4 EXPANSION] ────────────────
  {
    keywords: ["is not defined", "referenceerror", "undefined"],
    category: "JavaScript", issue: "Reference Variable Scope Gap",
    fix: "The variable is being accessed outside its declared scope or before initialization. Verify hoisting patterns, check for typos in variable names, and ensure all scripts are loaded in the correct order."
  },
  {
    keywords: ["is not a function", "typeerror", "null pointer"],
    category: "JavaScript", issue: "Object Type Mismatch",
    fix: "Attempted to call a method on 'null', 'undefined', or a non-function object. Use optional chaining (obj?.method()) and verify that the API response contains the expected data structure before processing."
  },
  {
    keywords: ["unexpected token", "syntaxerror", "parsing error", "json at position"],
    category: "System", issue: "Syntax/Parsing Failure",
    fix: "Malformed data structure detected (likely JSON or JS Syntax). Audit your build artifacts for unclosed brackets or invalid characters. If parsing an API response, ensure the Content-Type is application/json."
  },
  {
    keywords: ["cors", "access-control-allow-origin", "cross-origin"],
    category: "Networking", issue: "CORS Policy Violation",
    fix: "The browser blocked the request because the server's Access-Control-Allow-Origin header is missing or mismatched. Update the backend CORS configuration to allow the specific origin of your frontend."
  },
  {
    keywords: ["eaddrinuse", "port in use", "address already in use"],
    category: "Networking", issue: "Network Port Collision",
    fix: "Multiple processes are trying to bind to the same port. Identify the blocking process using 'lsof -i :<port>' or 'netstat -ano', then kill it or change your application's listening port."
  },
  {
    keywords: ["module not found", "cannot find module", "err_module_not_found"],
    category: "Backend", issue: "Dependency Resolution Failure",
    fix: "A required package or local file is missing from the runtime environment. Run 'npm install', verify file paths (case-sensitivity), and ensure your build process includes all necessary assets."
  },
  {
    keywords: ["unique constraint", "duplicate key", "already exists", "violates unique"],
    category: "Database", issue: "Database Data Collision",
    fix: "The operation failed because it attempted to insert a duplicate value into a unique column. Implement idempotency checks, use 'UPSERT' (INSERT ... ON CONFLICT), or verify client-side validation logic."
  },
  {
    keywords: ["foreign key", "fk constraint", "referential integrity"],
    category: "Database", issue: "Referential Integrity Violation",
    fix: "Attempted to delete or update a record that is referenced by another table. Review your deletion cascading policy or ensure the dependent records are cleaned up before modifying the parent."
  },
  {
    keywords: ["mixed content", "https", "insecure request"],
    category: "Security", issue: "SSL Mixed Content Block",
    fix: "Your HTTPS site is trying to load resources over HTTP. The browser blocked these for security. Update all external links (scripts, styles, APIs) to use HTTPS."
  },
  {
    keywords: ["socket.io", "websocket", "polling", "handshake failed"],
    category: "Networking", issue: "Real-time Socket Disconnect",
    fix: "The WebSocket connection was dropped or could not be established. Check for proxy/load balancer timeouts, verify sticky sessions are enabled if using multiple backend instances, and ensure the client/server versions match."
  },
  {
    keywords: ["permission denied", "chmod", "eacces", "0644"],
    category: "OS", issue: "File System Permission Gap",
    fix: "The application user lacks read/write permissions for the requested path. Adjust file permissions via 'chmod' or 'chown', or move the data to a directory the process is authorized to access."
  },
  {
    keywords: ["too many open files", "ulimit", "file descriptor"],
    category: "OS", issue: "OS File Descriptor Exhaustion",
    fix: "The process has hit the operating system's open file limit. Increase the ulimit for the user, audit for unclosed file handles or network sockets, and implement connection pooling."
  },
  {
    keywords: ["segmentation fault", "segfault", "core dumped"],
    category: "System", issue: "Critical Memory Corruption (Segfault)",
    fix: "The binary attempted to access an unauthorized memory address. This usually indicates a bug in a native C/C++ extension or an OS-level conflict. Check kernel logs (dmesg) and update your runtime environment."
  }
];
