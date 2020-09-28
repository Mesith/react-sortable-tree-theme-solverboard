import PropTypes from "prop-types";
import React, { Component } from 'react';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import CustomTheme from '../index';
import './app.css';

const ListItem = ({ avatarUrl }) => (
  <div
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <p>subtasks</p>
    <p>type</p>
    <p>target</p>
    <img className="avatar" src={avatarUrl} alt="user avatar" />
    <p>status</p>
  </div>
);

ListItem.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        { title: 'This is the Full Node Drag theme', borderColor: 'red', details: <ListItem level={1} entityID={123} avatarUrl="https://i.pravatar.cc/30" />, children: [{ title: "Egg" }] },
        { title: 'You can click anywhere on the node to drag it', level: 1 },
        {
          title: 'This node has dragging disabled',
          subtitle: 'Note how the hover behavior is different',
          dragDisabled: true,
        },
        { title: 'Chicken', level: 1, children: [{ title: 'Egg', level: 2, borderColor: '#ff00aa' }] },
      ],
    };
    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
  }

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const objectString = Object.keys(node)
        .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
        .join(',\n   ');

      global.alert(
        'Info passed to the icon and button generators:\n\n' +
        `node: {\n   ${objectString}\n},\n` +
        `path: [${path.join(', ')}],\n` +
        `treeIndex: ${treeIndex}`
      );
    };

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <div style={{ flex: '0 0 auto', padding: '0 15px' }}>
          <h3>Full Node Drag Theme</h3>
          <button onClick={this.expandAll}>Expand All</button>
          <button onClick={this.collapseAll}>Collapse All</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form
            style={{ display: 'inline-block' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event =>
                  this.setState({ searchString: event.target.value })
                }
              />
            </label>

            <button
              type="button"
              disabled={!searchFoundCount}
              onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
              type="submit"
              disabled={!searchFoundCount}
              onClick={selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </form>
        </div>

        <div style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}>
          <SortableTree
            theme={CustomTheme}
            treeData={treeData}
            onChange={this.updateTreeData}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            style={{ width: '80%' }}
            rowHeight={40}
            searchFinishCallback={matches =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })
            }
            canDrag={({ node }) => !node.dragDisabled}
            generateNodeProps={rowInfo => ({
              buttons: [
                <button onClick={() => alertNodeInfo(rowInfo)}>&#43;</button>,
                <button onClick={() => alertNodeInfo(rowInfo)}>&#8594;</button>,
              ],
            })}
          />
        </div>
      </div>
    );
  }
}

export default App;
