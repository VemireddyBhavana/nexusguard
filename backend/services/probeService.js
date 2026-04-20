// backend/services/probeService.js
import axios from 'axios';

/**
 * Proactive Prober Service
 * Performs deep technical handshakes with URLs to diagnose exactly WHY they fail.
 */
export async function probeURL(url) {
  const startTime = Date.now();
  try {
    // Attempt to fetch with a short timeout
    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true, // Don't throw on 4xx/5xx
      headers: { 'User-Agent': 'NexusGuard-Self-Prober/v2.1' }
    });

    const latency = Date.now() - startTime;
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        status: response.status,
        latency: `${latency}ms`,
        message: "Connectivity Verified. Target is responding usually.",
        diagnostics: "Handshake completed successfully. No immediate network blocks detected."
      };
    }

    // Handle standard HTTP errors
    return {
      success: false,
      status: response.status,
      latency: `${latency}ms`,
      errorType: `HTTP_${response.status}`,
      message: getHttpErrorMessage(response.status),
      diagnostics: `Target responded with ${response.status}. This usually indicates the server is UP but the application is CRASHED or UNAUTHORIZED.`
    };

  } catch (error) {
    // Handle Network Level Errors (Port closed, DNS failed, etc)
    const latency = Date.now() - startTime;
    let errorType = 'UNKNOWN_NETWORK_ERROR';
    let message = 'An unexpected network error occurred during probing.';
    let diagnostics = 'The probe could not complete the handshake. This suggests a deep infra level failure.';

    if (error.code === 'ECONNREFUSED') {
      errorType = 'PORT_NOT_LISTENING';
      message = 'Connection Refused: Target port is not listening.';
      diagnostics = 'The server is reachable, but nothing is running on this specific port. Check if your service process has crashed or is on a different port.';
    } else if (error.code === 'ENOTFOUND') {
      errorType = 'DNS_NOT_FOUND';
      message = 'Domain Not Found: Could not resolve hostname.';
      diagnostics = 'The DNS records for this link do not exist or the hostname is misspelled. If this is localhost, ensure your host file is correct.';
    } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      errorType = 'GATEWAY_TIMEOUT';
      message = 'Probing Timeout: The server took too long to respond.';
      diagnostics = 'The target server exists but is not sending back data. This usually indicates a massive CPU hang, a firewall block, or a deadlock.';
    } else if (error.code === 'ECONNRESET') {
      errorType = 'CONNECTION_RESET';
      message = 'Connection Reset: Remote host closed the connection.';
      diagnostics = 'The peer abruptly closed the connection. This often happens due to an application crash midway through the handshake or a firewall force-closing the link.';
    } else if (error.code === 'EADDRINUSE') {
      errorType = 'PORT_COLLISION';
      message = 'Port in Use: Local address is already bound.';
      diagnostics = 'The prober cannot bind to the local port because another process is using it. Verify if multiple instances of NexusGuard or other services are overlapping.';
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      errorType = 'SSL_HANDSHAKE_FAIL';
      message = 'SSL/TLS Handshake Failed.';
      diagnostics = 'The target server is using an untrusted certificate or an unsupported cipher suite. This is common in legacy systems or dev environments with expired certs.';
    }

    return { success: false, status: 0, latency: `${latency}ms`, errorType, message, diagnostics };
  }
}

function getHttpErrorMessage(status) {
  switch (status) {
    case 500: return "Internal Server Error: Application logic failure.";
    case 502: return "Bad Gateway: Upstream service is down.";
    case 503: return "Service Unavailable: Overloaded or Maintenance.";
    case 504: return "Gateway Timeout: Backend did not respond.";
    case 403: return "Forbidden: Permissions or Firewall block.";
    case 404: return "Not Found: Resource does not exist.";
    default: return `Error ${status}: Target server responded but failed to fulfill request.`;
  }
}
