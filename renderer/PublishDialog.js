import React from 'react'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form'
import TextField from 'material-ui/TextField';
import { remote } from 'electron'
import { LinearProgress } from 'material-ui/Progress'
import { defineMessages, FormattedMessage } from 'react-intl'
import Button from 'material-ui/Button'
import path from 'path'
const {api} = remote.require(path.resolve(__dirname, '../main/app.js'))

const messages = defineMessages({
  publishData : {
    id: 'publishData.title',
    defaultMessage: 'Publish data to website',
    description: 'Title for publishing data dialog'
  }
})

const styles = {
  publishButton: {
    marginBottom: 18
  },
  body: {
    marginBottom: 12,
    minHeight: 100,
    display: 'flex',
    textAlign: 'center',
    padding: '12px 12px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
}

const CancelButton = ({onClick, disabled}) => (
  <Button
    style={styles.button}
    variant='raised'
    disabled={disabled}
    onClick={onClick}>
    Cancel
  </Button>
)

const GoButton = ({onClick}) => (
  <Button
    style={styles.button}
    onClick={onClick}
    variant='raised'
    autoFocus
    color='primary'>
    Publish
  </Button>
)

const BodyActions = ({onClick}) => (
  <div style={styles.body}>
  </div>
)

class PublishDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleEnter = () => {
    this.setState({
      error: null,
      server: this.props.server || '',
      progress: 0
    })
  }

  handlePublishButton = () => {
    var self = this
    this.setState({progress: 1})
    this.props.doPublish(this.state.server, function done (err) {
      if (err) return self.handleError(err)
      self.setState({progress: 0})
      self.props.onRequestClose()
    })
  }

  handleError = (err) => {
    this.setState({
      error: err,
      progress: 0
    })
  }

  handleChange = event => {
    this.setState({
      server: event.target.value
    })
  }

  render () {
    let cardBody
    const {open, server, onRequestClose} = this.props
    const {progress, error} = this.state

    switch (progress) {
      case 0: // not started
        cardBody = (
          <FormControl>
            <TextField
            error={error ? true : false}
            id="server-field"
            label="Server"
            onChange={this.handleChange}
            defaultValue={server}
            margin="normal"
            />
          </FormControl>
        )
        break
      default: // in progress
        cardBody = <LinearProgress mode='determinate' value={progress * 100} />
    }
    return <Dialog open={open} maxWidth='sm' fullWidth onRequestClose={onRequestClose} onEnter={this.handleEnter}>
      <DialogTitle>
        <FormattedMessage {...messages.publishData} />
      </DialogTitle>
      <DialogContent>
        {cardBody}
      </DialogContent>
      <DialogActions>
        <GoButton onClick={this.handlePublishButton} />
        <CancelButton onClick={onRequestClose} disabled={progress > 0} />
      </DialogActions>
    </Dialog>
  }
}

module.exports = PublishDialog
