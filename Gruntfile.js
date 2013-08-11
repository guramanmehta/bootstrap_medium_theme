module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-recess');

	// Default task.
	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', ['clean', 'jade:index', 'recess:build', 'copy:fonts']);
	grunt.registerTask('release', ['clean', 'jade:index', 'recess:release', 'copy:fonts']);

	// Print a timestamp (useful for when watching)
	grunt.registerTask('timestamp', function() {
	grunt.log.subhead(Date());
	});
	
	// Project configuration.
	grunt.initConfig({
		distdir: 'dist',
		pkg: grunt.file.readJSON('package.json'),
		banner:
		'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
		' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
		' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
		src: {
			js: ['src/**/*.js'],
			index: ['src/*.jade'],
			jade: ['src/**/*.jade'],
			tpl: ['src/templates/**/*.tpl.html'],
			lessWatch: ['src/less/*.less'], // this is for the watch task
			less: ['src/less/stylesheet.less'] // recess:build doesn't accept ** in its file patterns
		},
		clean: {
			main: ['<%= distdir %>/*']
		},
		copy: {
			fonts: {
				files: [
					{ dest: '<%= distdir %>/font', src: '**', expand: true, cwd: 'vendor/font-awesome/font' },
					{ dest: '<%= distdir %>/font', src: '**', expand: true, cwd: 'vendor/pt-serif' },
					{ dest: '<%= distdir %>/font', src: '**', expand: true, cwd: 'vendor/opensans' }
				]
			}
		},
		jade: {
			index: {
				options: {
					pretty: true,
					data: {
						project: '<%= pkg._project %>',
						appName: '<%= pkg.name %>',
						author: '<%= pkg.author %>'
					}
				},
				files: [{
					expand: true,
					cwd: 'src',
					src: ['*.jade'],
					dest: '<%= distdir %>/',
					ext: '.html'
				}]
			},
			templates: {
				options: {
					data: {
						company: '<%= pkg._company %>',
						project: '<%= pkg._project %>'
					}
				},
				files: [{
					expand: true,
					cwd: 'src',
					src: ['**/*.tpl.jade'],
					dest: '<%= distdir %>/templates/',
					ext: '.tpl.html'
				}]
			}
		},
		recess: {
			build: {
				files: {
					'<%= distdir %>/css/<%= pkg.name %>.css':
					['<%= src.less %>'] },
				options: {
					compile: true
				}
			},
			release: {
				files: {
					'<%= distdir %>/css/<%= pkg.name %>.css': 
					['<%= src.less %>']
				},
				options: {
					compress: true
				}
			}
		},
		watch:{
			all: {
				files:['src/**/*'],
				tasks:['build', 'timestamp']
			},
			build: {
				files:['<%= src.js %>', '<%= src.lessWatch %>', '<%= src.jade %>', '<%= src.index %>'],
				tasks:['jshint', 'build','timestamp']
			},
			dev: {
				files:['<%= src.js %>', '<%= src.lessWatch %>', '<%= src.jade %>', '<%= src.index %>'],
				tasks:['dev','timestamp']
			}
		}
	});

};
