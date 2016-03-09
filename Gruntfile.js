/*
 *  Configuration holder
 *
 *  Created by Christian Dallago on 20160309 .
 */

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: [
          '*.js',
          'controllers/*.js',
          'daos/*.js',
          'models/*.js',
          'services/*.js',
      ],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);

};