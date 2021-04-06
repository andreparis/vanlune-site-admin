import React, {Component, Fragment} from 'react'
import Dropzone from 'react-dropzone-uploader'


export class MyUploader extends Component {
  constructor(props) {
    super(props)
  }
  // specify upload params and url for your files
  getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

  render() { 
    return (
    <Fragment>
      <div className="dropzone">
        <Dropzone
        getUploadParams={this.getUploadParams}
        onChangeStatus={this.props.handleChangeStatus}
        onSubmit={this.props.handleSubmit}
        accept="image/*"
        canRemove={true}
      />
      </div>    
    </Fragment>)
  }
}

export default MyUploader