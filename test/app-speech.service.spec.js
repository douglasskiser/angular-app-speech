(function() {
    'use strict';

    describe('Service: AppSpeech', function() {
        var AppSpeech,
            $window,
            $timeout,
            $log;

        beforeEach(module('dk.appSpeech'));

        beforeEach(inject(function(_AppSpeech_, _$window_, _$timeout_, _$log_) {
            AppSpeech = _AppSpeech_;
            $window = _$window_;
            $timeout = _$timeout_;
            $log = _$log_;
        }));

        it('should be defined', function() {
            expect(AppSpeech).toBeDefined();
            expect(typeof AppSpeech).toBe('object');
        });

        describe('Method: isSupported', function() {
            it('should be defined', function() {
                expect(AppSpeech.isSupported).toBeDefined();
                expect(typeof AppSpeech.isSupported).toBe('function');
            });
        });

        describe('Method: start', function() {
            it('should be defined', function() {
                expect(AppSpeech.start).toBeDefined();
                expect(typeof AppSpeech.start).toBe('function');
            });
        });

        describe('Method: run', function() {
            it('should be defined', function() {
                expect(AppSpeech.run).toBeDefined();
                expect(typeof AppSpeech.run).toBe('function');
            });
        });

        describe('Method: abort', function() {
            it('should be defined', function() {
                expect(AppSpeech.abort).toBeDefined();
                expect(typeof AppSpeech.abort).toBe('function');
            });
        });

        describe('Method: debug', function() {
            it('should be defined', function() {
                expect(AppSpeech.debug).toBeDefined();
                expect(typeof AppSpeech.debug).toBe('function');
            });
        });

        describe('Method: setLanguage', function() {
            it('should be defined', function() {
                expect(AppSpeech.setLanguage).toBeDefined();
                expect(typeof AppSpeech.setLanguage).toBe('function');
            });
        });

        describe('Method: getLanguage', function() {
            it('should be defined', function() {
                expect(AppSpeech.getLanguage).toBeDefined();
                expect(typeof AppSpeech.getLanguage).toBe('function');
            });
        });

        describe('Method: addCommands', function() {
            it('should be defined', function() {
                expect(AppSpeech.addCommands).toBeDefined();
                expect(typeof AppSpeech.addCommands).toBe('function');
            });
        });

        describe('Method: removeCommands', function() {
            it('should be defined', function() {
                expect(AppSpeech.removeCommands).toBeDefined();
                expect(typeof AppSpeech.removeCommands).toBe('function');
            });
        });

        describe('Method: addCallback', function() {
            it('should be defined', function() {
                expect(AppSpeech.addCallback).toBeDefined();
                expect(typeof AppSpeech.addCallback).toBe('function');
            });
        });
    });
}());
