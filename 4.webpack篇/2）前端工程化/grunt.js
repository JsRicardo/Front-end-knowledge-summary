module.exports = function(grunt) {
    // 所有插件的配置信息
    grunt.initConfig({
      // uglify 插件的配置信息
      uglify: {
        app_task: {
          files: {
            'build/app.min.js': ['lib/index.js', 'lib/test.js']
          }
        }
      },
      // watch 插件的配置信息
      watch: {
        another: {
            files: ['lib/*.js'],
        }
      }
    });
  
    // 告诉 grunt 我们将使用这些插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
  
    // 告诉grunt当我们在终端中启动 grunt 时需要执行哪些任务
    grunt.registerTask('dev', ['uglify','watch']);
  };