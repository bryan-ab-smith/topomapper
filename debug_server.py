import platform
import sys

try:
    # Python 3
    import http.server
except ImportError:
    # Python 2
    import SimpleHTTPServer

try:
    # Python 3
    import socketserver
except ImportError:
    # Python 2
    import SocketServer

pyVer = int(platform.python_version_tuple()[0])
port = 8000
try:
    if pyVer < 3:
        # Credit to https://docs.python.org/2/library/simplehttpserver.html
        Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
        httpd = SocketServer.TCPServer(('', port), Handler)
        # https://stackoverflow.com/a/31746811
        httpd.allow_reuse_address = True
        print('Running at http://localhost:{}. Press Ctrl-C to exit.'.format(port))
        httpd.serve_forever()
    else:
        # Credit to https://www.afternerd.com/blog/python-http-server/
        Handler = http.server.SimpleHTTPRequestHandler

        with socketserver.TCPServer(('', port), Handler) as httpd:
            print('Running at http://localhost:{}. Press Ctrl-C to exit.'.format(port))
            httpd.serve_forever()
except KeyboardInterrupt:
    sys.exit(0)
