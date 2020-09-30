import React, { Component } from 'react';
import { Link } from 'react-router-dom';




class Task extends Component {
    render(){
        let {id,title,createdAt,completed,onRemove,onUpdate} = this.props;
        return (
        <div className="list-group-item d-flex flex-column">
            <div className="d-flex flex-row align-items-center justify-content-between">
                <input className="mr-2" type="checkbox" value={completed} onChange={()=>onUpdate({id:id,title:title,taskDate:taskDate,completed:!completed})}/>
                <Link to={`/tasks/${id}`}>
                    {title}
                </Link>
                <div className="ml-2 btn-group">
                    <Link className="btn btn-outline-primary" to={`/tasks/${id}?edit`}>
                        Edit
                    </Link>
                    <button className="btn btn-outline-danger" onClick={()=>onRemove(id)}>
                        Delete
                    </button>
                </div>
            </div>
            <small className="text-muted align-self-end">
                {"Created " + createdAt}
            </small>
        </div>)

    }
}

Task.defaultProps = {
    id:1,
    title:"Complete client and server",
    completed:false,
    createdAt:"14"
}

export default Task;