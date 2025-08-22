# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "diary_fx_fluid", to: "diary_fx_fluid.js"
# config/importmap.rb
pin "fluid_global", to: "fluid_global.js"

pin "custom_cursor", to: "custom_cursor.js"
