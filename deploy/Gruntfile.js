module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compress: {
            host: {
                options: {
                    archive: 'dist/host.wgt',
                    mode: 'zip'
                },
                files: [
                    { expand: true, cwd: '../apps', src: ['**'], dest: '/' },
                    { expand: true, cwd: './host', src: ['config.xml'], dest: '/' },
                    { src: ['icon-party-player.png'], dest: '/' }
                ]
            },
            guest: {
                options: {
                    archive: 'dist/guest.wgt',
                    mode: 'zip'
                },
                files: [
                    { expand: true, cwd: '../apps', src: ['**'], dest: '/' },
                    { expand: true, cwd: './guest', src: ['config.xml'], dest: '/' },
                    { src: ['icon-party-player.png'], dest: '/' }
                ]
            },
            ivi: {
                options: {
                    archive: 'dist/ivi.wgt',
                    mode: 'zip'
                },
                files: [
                    { expand: true, cwd: '../apps', src: ['**'], dest: '/' },
                    { expand: true, cwd: './ivi', src: ['config.xml'], dest: '/' },
                    { src: ['icon-party-player.png'], dest: '/' }
                ]
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask('default', ['compress']);
}