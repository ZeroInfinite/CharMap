var React = require('react/addons');
var ReactWinJS = require('react-winjs');

// UNDONE: for development, just jam the content in here... :)
window.unicode = global_data;

function shorten(str) {
    var maxLen = 20;
    if (str.length > maxLen) {
        return str.substring(0, maxLen-3) + "...";
    }
    return str;
}

var App = React.createClass({
    charItemRenderer: ReactWinJS.reactRenderer(function (item) {
        return (
            <div className="container">
                <div className="letter" dangerouslySetInnerHTML={{__html: 
                    item.data.name === "<control>" ? " " : "&#x" + item.data.code.toString(16) + ";"
                }} />
                <div>{item.data.code.toString(16) + " - " + (
                    item.data.name === "<control>" ? item.data.altName + " (control)" : item.data.name
                )}</div>
            </div>
        );
    }),
    gridLayout: { type: WinJS.UI.GridLayout },
    handleChangeBlockIndex: function (eventObject) {
        var newBlockIndex = eventObject.currentTarget.value;
        if (newBlockIndex !== this.state.blockIndex) {
            this.setState({
                blockIndex: newBlockIndex,
                charList: new WinJS.Binding.List(CharMap.createBlock(newBlockIndex))
            });
        }
    },
    handleToggleSplitView: function () {
        var splitView = this.refs.splitView.winControl;
        splitView.paneHidden = !splitView.paneHidden;
    },
    handleSearchString: function (eventObject) {
        var newSearchString = eventObject.currentTarget.value;
        if (newSearchString !== this.state.searchString) {
            this.setState({ searchString: newSearchString });
        }
    },
    listClicked: function () {
        this.setState({
            mode: "default"
        });
    },
    getInitialState: function () {
        var initialBlockIndex = 4;
        return {
            mode: "default",
            searchString: "",
            blockIndex: initialBlockIndex,
            charList: new WinJS.Binding.List(CharMap.createBlock(initialBlockIndex))
        };
    },
    renderDefault: function () {
        return  (
            <div className="contenttext">
                <div id="header">
                    <h1 id="title">CharMap React</h1>
                </div>

                <ReactWinJS.ListView
                    id="content"
                    className="content"
                    style={{paddingTop: "30px"}}
                    itemDataSource={this.state.charList.dataSource}
                    itemTemplate={this.charItemRenderer}
                    selectionMode="none"
                    tapBehavior="none"
                    layout={this.gridLayout} />
            </div>
        );
    },
    render: function() {
        var paneComponent = (
            <div>
                <div className="header">
                    <button type="button" className="win-splitview-button" onClick={this.handleToggleSplitView}></button>
                    <div className="title">CharMap</div>
                </div>

                <div className="nav-commands">
                    <ReactWinJS.NavBarCommand onClick={CharMap.homeClicked} key="home" label="Home" icon="home" />
                    <ReactWinJS.NavBarCommand onClick={this.listClicked} key="list" label="List" icon="list" />
                </div>
            </div>
        );

        var contentComponent = this.renderDefault();

        return <ReactWinJS.SplitView
            ref="splitView"
            paneComponent={paneComponent}
            contentComponent={contentComponent} />
    }
});

React.render(<App />, document.getElementById("app"));