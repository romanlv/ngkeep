import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
} from 'react-native'

/* @flow weak */

import PropTypes from 'prop-types'

import R from 'ramda'

import { connect } from 'react-redux'
import { AppStyles, Fonts, Colors } from '../themes'
import { Actions as RouteActions } from 'react-native-router-flux'

import actions from '../actions/creators'
import SearchComponent from '../components/SearchComponent'
import ConnectionType from '../components/ConnectionType'
import relTypes, { relNames, onStartIcons } from '../constants/relTypes'


// import { findRelatedNotes } from '../reducers/queries'


const allowedTypes = [relTypes.related, relTypes.defines, relTypes.custom]

const connectionTypes = allowedTypes.map(id => {
  return {
    id,
    name: relNames[id],
    icon: onStartIcons[id],
  }
})


const mapStateToProps = (state, ownProps) => {
  const { noteId } = ownProps
  const { editor, notes } = state
  const items = R.path(['groups', editor.groupId, 'items'])(state)

  const matchedNotes = R.compose(
    R.reject(R.propEq('id', noteId)),
    R.map(i => notes[i.id])
  )(items)

  return {
    groupId: editor.groupId,
    curNote: notes[noteId],
    matchedNotes,
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveRelation: (groupId: string, curNoteId: string, selNoteId: string, conType: ConType) => {
      const rel = {
        from: curNoteId,
        to: selNoteId,
        type: conType.id,
      }
      dispatch(actions.saveRelation(groupId, rel))
      RouteActions.pop()
    }
  }
}

class AddRelation extends Component {
  static propTypes = {
    noteId: PropTypes.string.isRequired,
    groupId: PropTypes.string.isRequired,
    curNote: PropTypes.object.isRequired,
    matchedNotes: PropTypes.arrayOf(PropTypes.any).isRequired,
    saveRelation: PropTypes.func.isRequired,
    // editNote: PropTypes.func.isRequired,
    // viewNote: PropTypes.func.isRequired,
    // saveNote: PropTypes.func.isRequired,
  }

  state: {
    selectedNote?: any,
  }

  constructor (props) {
    super(props)

    this.state = {
      // selectedNote: null,
    }
  }


  onResultPress = (note) => {
    this.setState({
      selectedNote: note,
    })
  }

  renderResults () {
    const { matchedNotes } = this.props
    return matchedNotes.map((note, index) =>
      <FoundNote
        key={note.id}
        note={note}
        index={index}
        onSelect={this.onResultPress}
      />
    )
  }

  renderNoteSearch () {
    const { matchedNotes } = this.props
    return (
      <SearchComponent
        allRecords={matchedNotes}
        onSelect={this.onResultPress}
      />
    )
  }

  onConnectionTypePress = (conType: ConType) => {
    const { curNote, groupId, saveRelation } = this.props
    const selNote = this.state.selectedNote
    if (!selNote) return

    saveRelation(groupId, curNote.id, selNote.id, conType)
  }

  renderRelationSelect () {
    return (
      <View>
        <Text style={styles.header}>Select Connection Type</Text>
        {connectionTypes.map(t => (
          <ConnectionType
            key={t.id}
            type={t}
            onSelect={this.onConnectionTypePress}
          />)
        )}
      </View>
    )
  }

  render () {
    const { selectedNote } = this.state

    return (
      <View style={styles.container}>
        {!selectedNote ? this.renderNoteSearch() : this.renderRelationSelect() }
      </View>
    )
  }
}


// const REL_WIDTH = (width - PADDING_H * 2) / 2

const styles = StyleSheet.create({
  ...AppStyles.screen,
  container: {
    padding: 10,
    flex: 1,
    // flexDirection: 'row',

  },
  results: {
    marginTop: 20,
  },
  header: {
    paddingTop: 10,
    fontSize: Fonts.size.h5,
    // color: 'red',
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(AddRelation)


// flow types

type ConType = {
  id: string, name: string,
}
