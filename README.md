# Flag-Zig-Zag

run "npm install" after [forking][forking] to install all module dependencies from package.json

[forking]: http://help.github.com/fork-a-repo/

# running on localhost

Some OAuth Providers do not allow callbacks to localhost, so you will need to create a localhost alias called local.host. Make sure you set up your /etc/hosts so that 127.0.0.1 is also associated with 'local.host'. So inside your /etc/hosts file, one of the lines will look like:
<code>127.0.0.1    localhost local.host</code>