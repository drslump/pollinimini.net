# http://github.com/appden/appden.github.com/blob/master/Rakefile
 
task :default => :server
 
desc 'Build site with Jekyll'
task :build do
  jekyll('build')
end
 
desc 'Start server with --auto'
task :server do
  jekyll('server --watch')
end
 
def jekyll(opts = '')
  sh 'rm -rf _site'
  sh 'jekyll ' + opts
end