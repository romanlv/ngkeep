import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  StatusBar,
} from 'react-native'

import { Colors } from './themes'

import { Provider } from 'react-redux'
import NavigationRouter from './navigation/NavigationRouter'


export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <View style={styles.applicationView}>
          <StatusBar
            backgroundColor={Colors.statusBar}
            barStyle="light-content"
          />
          <NavigationRouter />
        </View>
      </Provider>
    )
  }
}



const styles = StyleSheet.create({
  applicationView: {
    flex: 1
  }
})
