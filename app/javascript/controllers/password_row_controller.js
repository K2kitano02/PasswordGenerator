import { Controller } from "@hotwired/stimulus"

// 一覧の行クリックで詳細（show）に遷移する
export default class extends Controller {
  static values = {
    url: String
  }

  navigate() {
    if (this.urlValue) window.location.href = this.urlValue
  }
}
