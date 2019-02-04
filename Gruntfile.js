/*global module, require*/
"use strict";

const Glob = require("glob");
const Terser = require("terser");
const Fs = require("fs");
const Path = require("path");

const Package = JSON.parse(Fs.readFileSync("package.json", "utf8"));
const DestPath = `./release/${Package.name} ${Package.version}/`;

module.exports = function(grunt) {
    var root = "./";
    var dest = "./release/<%= pkg.name %> <%= pkg.version %>/";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        eslint: {
            options: {
                configFile: root + ".eslintrc.js",
            },
            target: [root + "js/**", root + "map_editor/static/**"],
        },

        // delete the destination folder
        clean: {
            release: [dest],
        },

        // copy the audio and libraries files
        copy: {
            libraries: {
                files: [
                    {
                        expand: true,
                        cwd: Path.join(root, "node_modules/easeljs/lib/"),
                        src: "easeljs.min.js",
                        dest: Path.join(root, "libraries/"),
                    },
                    {
                        expand: true,
                        cwd: Path.join(root, "node_modules/preloadjs/lib/"),
                        src: "preloadjs.min.js",
                        dest: Path.join(root, "libraries/"),
                    },
                    {
                        expand: true,
                        cwd: Path.join(root, "node_modules/soundjs/lib/"),
                        src: "soundjs.min.js",
                        dest: Path.join(root, "libraries/"),
                    },
                ],
            },

            release: {
                expand: true,
                cwd: root,
                src: [
                    "audio/**",
                    "images/*.png",
                    "libraries/**",
                    "maps/**",
                    "package.json",
                ],
                dest: dest,
            },
        },

        cssmin: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: root + "css/",
                        src: "*.css",
                        dest: dest + "css/",
                    },
                ],
            },
            options: {
                advanced: false,
            },
        },

        processhtml: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: root,
                        src: "index.html",
                        dest: dest,
                    },
                ],
            },
        },
    });

    // load the plugins
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-processhtml");

    /**
     * Run the javascript minimizer task.
     */
    grunt.registerTask("terser", function() {
        const files = Glob.sync(root + "js/**/*.js");
        const code = [];

        for (let a = 0; a < files.length; a++) {
            const filePath = files[a];

            code[filePath] = Fs.readFileSync(filePath, "utf8");
        }

        const result = Terser.minify(code, {
            ecma: 8,
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        Fs.writeFileSync(DestPath + "min.js", result.code);
    });

    // tasks
    grunt.registerTask("default", [
        "eslint",
        "clean",
        "copy",
        "terser",
        "cssmin",
        "processhtml",
    ]);
};
