import {createMixin} from '../../../node_modules/polymer-redux';
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '../../css/shared-styles.js';
import '../../components/layouts/main-layout.js';
import '../../components/main-join.js';
import store from '../../global/store.js';
const ReduxMixin = createMixin(store);

class PageSearch extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          background-color: var(--host-background-color);
          color: var(--host-color);
        }
        .container{
            max-width: 300px;
            margin: 0 auto;
            padding-top:0px;
            display: block;
        }
        .search-results{
          display: var(--show-search, none); 
          color: var(--placeholder-color);
          width: 250px;
          position: relative;
          left: 12px;
          padding: 4px 0 1px 0;
        }
        
        .search-results ul{
          list-style:none;
          padding: 0px;
        }
        .search-results img {
          width: 33px;
          height: 33px;
          border-radius: 50%;
          background-color: grey;
          margin: 6px 12px 6px 0;
        }
        .title {
          margin-top: 6px;
          font-size: 14px;
          font-weight: 600;
          text-transform: capitalize;
        }
        .subtitle{
          font-size: 12px;
          font-weight: 400;
        }
        .result-container{
          display: flex;
          padding: 0 12px;
          padding-bottom: 12px;
        }
        
      </style>
  
      <main-layout> 
          <div slot="aside">
          </div>
          <div slot="body">
              <div class="container">
                <label for="male">Search</label>
                <input type="text" name="search" id="search" on-keyup="_search" value="{{term::input}}">

                <div class="search-results">
                  <ul>
                    <dom-repeat items="{{results.name}}">
                      <template>
                        <li class="result-container">
                        <img src="https://s3-us-west-1.amazonaws.com/ozark/[[item._id]]/pfp_200x200.jpg?versionId=null">
                          <div>
                            <div class="title">[[item.name]]</div>
                            <div class="subtitle">[[item.lastSeen]]</div> 
                          </div>
                        </li>
                      </template>
                    </dom-repeat>
                  </ul>
                </div>

              </div>
          </div>
      </main-layout>
    `;
  }

  static get properties() {
    return {
      language: {
        type: String,
        readOnly: true,
      },
      mode: {
        type: String,
        readOnly: true,
        observer: '_mode',
      },
      env: {
        type: Object,
        readOnly: true,
      },
      color: {
        type: Object,
        readOnly: true,
      },
    };
  }

  static mapStateToProps(state, element) {
    return {
      language: state.language,
      mode: state.mode,
      env: state.env,
      color: state.color,
    };
  }

  _search(e) {
    const term = this.term;
    if (e.keyCode === 13) {
      this._getUsers();
    }
    if (term && term.length > 2) {
      this._getUsers();
    }
  }

  _getUsers() {
    const url = `${this.env.apiUrl}/users/search/`;
    const term = this.term;
    const data = {term};
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'},
    })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.updateStyles({'--show-search': 'block'});
          this.results = response.results;
          console.log(this.results);
        });
  }

  _mode() {
    this.updateStyles({'--blue-color': this.color.blue});
    this.updateStyles({'--grey-color': this.color.grey});
    this.updateStyles({'--red-color': this.color.red});
    this.updateStyles({'--green-color': this.color.green});
    if (this.mode === 'light') {
      this.updateStyles({'--black3-white3': this.color.white3});
      this.updateStyles({'--white1-black1': this.color.black1});
      this.updateStyles({'--white2-black2': this.color.black2});
      this.updateStyles({'--black3-white1': this.color.white1});
      this.updateStyles({'--black1-white2': this.color.white2});
      this.updateStyles({'--black1-white3': this.color.white3});
      this.updateStyles({'--white2-black3': this.color.black3});
    } else {
      this.updateStyles({'--black3-white3': this.color.black3});
      this.updateStyles({'--white1-black1': this.color.white1});
      this.updateStyles({'--white2-black2': this.color.white2});
      this.updateStyles({'--black3-white1': this.color.black3});
      this.updateStyles({'--black1-white2': this.color.black1});
      this.updateStyles({'--black1-white3': this.color.black1});
      this.updateStyles({'--white2-black3': this.color.white2});
    }
  }
} window.customElements.define('page-search', PageSearch);
