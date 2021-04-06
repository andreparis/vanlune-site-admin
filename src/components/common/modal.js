import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

export class MyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {
        const { open } = this.state;
        const { title, onCloseModal, handleOnChange, inputs } = this.props;
        return (<Modal open={open} onClose={onCloseModal} >
            <div className="modal-header">
                <h5 className="modal-title f-w-600" id="exampleModalLabel2">{title}</h5>
            </div>
            <div className="modal-body">
                <form>
                    {inputs && inputs.length > 0 ? 
                        inputs.map((item, i) => {
                            return (<div className="form-group" key={i}>
                                    <label htmlFor="recipient-name" className="col-form-label" >{item} :</label>
                                    <input type="text" className="form-control" name={item} onChange={handleOnChange}/>
                                </div>)
                        })
                    : ''
                    }
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => onCloseModal('save')}>Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => onCloseModal('close')}>Close</button>
            </div>
        </Modal>)
    }
}

export default MyModal;