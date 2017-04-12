module.exports = function( grunt )
{
var root = '../';
var dest = '../release/<%= pkg.name %> <%= pkg.version %>/';

grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        eslint: {
            options: {
                configFile: root + '.eslintrc.js'
            },
            target: [ root + 'js/**' ]
        },

            // delete the destination folder
        clean: {
            options: {
                force: true
            },
            release: [
                dest
            ]
        },

            // copy the audio and libraries files
        copy: {
            release: {
                expand: true,
                cwd: root,
                src: [
                    'audio/**',
                    'images/*.png',
                    'libraries/**',
                    'maps/**',
                    'background.js',
                    'manifest.json'
                ],
                dest: dest
            }
        },

        uglify: {
            release: {
                files: [{
                    src: [
                        root + 'js/*.js'
                    ],
                    dest: dest + 'min.js'
                }]
            }
        },

        cssmin: {
            release: {
                files: [{
                    expand: true,
                    cwd: root + 'css/',
                    src: '*.css',
                    dest: dest + 'css/'
                }]
            },
            options: {
                advanced: false
            }
        },

        processhtml: {
            release: {
                files: [{
                    expand: true,
                    cwd: root,
                    src: 'index.html',
                    dest: dest
                }]
            }
        }
    });

    // load the plugins
grunt.loadNpmTasks( 'grunt-eslint' );
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-processhtml' );

    // tasks
grunt.registerTask( 'default', [ 'eslint', 'clean', 'copy', 'uglify', 'cssmin', 'processhtml' ] );
};
