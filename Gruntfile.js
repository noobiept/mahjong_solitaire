/*global module, require*/
"use strict";

const Glob = require("glob");
const Terser = require("terser");
const Fs = require("fs");
const Path = require("path");
const ChildProcess = require("child_process");

const Package = JSON.parse(Fs.readFileSync("package.json", "utf8"));
const ROOT = "./";
const DEST = `./release/${Package.name} ${Package.version}/`;

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // delete the destination folder and the previously compiled javascript files
        clean: {
            release: [DEST, Path.join(ROOT, "scripts/**/*.js")],
            libraries: [Path.join(ROOT, "libraries/**")],
        },

        // copy the audio and libraries files
        copy: {
            libraries: {
                files: [
                    {
                        expand: true,
                        cwd: Path.join(ROOT, "node_modules/easeljs/lib/"),
                        src: "easeljs.min.js",
                        dest: Path.join(ROOT, "libraries/"),
                    },
                    {
                        expand: true,
                        cwd: Path.join(ROOT, "node_modules/preloadjs/lib/"),
                        src: "preloadjs.min.js",
                        dest: Path.join(ROOT, "libraries/"),
                    },
                ],
            },

            release: {
                expand: true,
                cwd: ROOT,
                src: [
                    "audio/**",
                    "images/*.png",
                    "libraries/**",
                    "maps/**",
                    "index.html",
                    "package.json",
                ],
                dest: DEST,
            },
        },

        cssmin: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: ROOT + "css/",
                        src: "*.css",
                        dest: DEST + "css/",
                    },
                ],
            },
            options: {
                advanced: false,
            },
        },
    });

    /**
     * Run the javascript minimizer task.
     */
    grunt.registerTask("terser", function() {
        const files = Glob.sync(ROOT + "scripts/**/*.js");

        for (let a = 0; a < files.length; a++) {
            const filePath = files[a];
            const destPath = Path.join(DEST, filePath);
            const directoryPath = Path.dirname(destPath);

            const code = Fs.readFileSync(filePath, "utf8");
            const result = Terser.minify_sync(code, {
                ecma: 2022,
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            if (!Fs.existsSync(directoryPath)) {
                Fs.mkdirSync(directoryPath, { recursive: true });
            }

            Fs.writeFileSync(destPath, result.code);
        }
    });

    /**
     * Run the typescript compiler.
     */
    grunt.registerTask("typescript", function() {
        ChildProcess.execSync("tsc");
    });

    // load the plugins
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-clean");

    // tasks
    grunt.registerTask("update_libraries", [
        "clean:libraries",
        "copy:libraries",
    ]);
    grunt.registerTask("default", [
        "clean",
        "typescript",
        "copy:libraries",
        "copy:release",
        "terser",
        "cssmin",
    ]);
};
