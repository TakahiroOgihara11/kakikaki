// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "./tweets_index"
import "./diary_new"
import "./header_effects"
import "./theme_picker"
import "./theme"
import "./theme_persist";
// 既存の diary_new.js の末尾あたりで
import "diary_fx";
import "diary_fx_fluid";
import "fluid_global"; // ← 全ページ背景をON
