define(function(require, exports, module) {
    var settingID = "Presentation Setting";
    var Setting = Backbone.Model.extend({
        localStorage: new Store("Settings")
    });

    Setting = Backbone.UniqueModel(Setting, 'Setting', 'localStorage');

//    var SettingCollection = Backbone.Collection.extend({
//        localStorage: new Backbone.LocalStorage('settings'),
//        model: Setting
//    });

    Setting.load = _.memoize(function() {
        console.log("Setting init");
//        this.settingsCollection = new SettingCollection();
//        Setting.on('uniquemodel.add', _.bind(this.settingsCollection.add, this.settingsCollection));
        this.appSetting = new Setting({
            id: settingID
        });
//        this.settingsCollection.add(this.appSetting);
//        this.appSetting.fetch();
//        window.configs = {};
//        if(navigator.presentation == undefined){
//            window.configs.dev = "devModel";
//        }
        return this.appSetting;
    });
    module.exports = Setting.load();
});