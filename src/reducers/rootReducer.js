import { 
    SET_TITLE,
    ERROR
} from "../actions/actions";
import { 
    ADD_SUBTASK,
    REMOVE_SUBTASK
} from "../actions/subTaskActions";
import { 
    REMOVE_TASK,
    REQUEST_TASKS,
    RECEIVE_TASKS,
    REQUEST_TASK,
    RECEIVE_TASK,
    ERROR_RECEIVING_TASK,
    ERROR_RECEIVING_TASKS } from "../actions/taskActions";

var rootReducer = function(state,action){
    switch(action.type){
        case SET_TITLE:
            document.title = action.title;
            return state;
        case REQUEST_TASKS:
            return {
                        ...state,
                        tasks:{
                            ...state.tasks,
                            isLoading:true
                        },
                        ui:{
                            ...state.ui,
                            taskFetchingError:undefined
                        }
                    };
        case RECEIVE_TASKS:
            let tasks = {};
            action.tasks.forEach(item=>tasks = Object.assign(tasks,{[item.id]:{...item,subTasks:[]}}));
            return {
                        ...state,
                        tasks:{
                            isLoading:false,
                            updatedAt:action.receivedAt,
                            items:tasks
                        }
                    };
        case REQUEST_TASK:
            return {
                        ...state,
                        tasks:{
                            ...state.tasks,
                            items:{
                                ...state.tasks.items,
                                [action.id]:{
                                    isLoading:true,
                                    title:"",
                                    subTasks:[],
                                    completed:false,
                                    createdAt:""
                                }
                            }
                        }
                    };
        case RECEIVE_TASK:
            return {
                        ...state,
                        tasks:{
                            ...state.tasks,
                            items:{
                                ...state.tasks.items,
                                [action.task.id]:{
                                    ...action.task,
                                    isLoading:false
                                }
                            }
                        }
                    };
        case REMOVE_TASK:
            delete state.tasks.items[action.id];
            return {
                        ...state,
                        tasks:{
                            ...state.tasks,
                            items:{
                                ...state.tasks.items
                            }
                        }
                    };
        case REMOVE_SUBTASK:
            let index = state.tasks.items[action.taskId].subTasks.findIndex((value)=>value.id==action.id);
            return {
                        ...state,
                        tasks:{
                            ...state.tasks,
                            items:{
                                ...state.items,
                                [action.taskId]:{
                                    ...state.tasks.items[action.taskId],
                                    subTasks:state.tasks.items[action.taskId].subTasks.splice(index,1)
                                }
                            }
                        }
                    };
        case ADD_SUBTASK:
            state.tasks.items[action.taskId].subTasks.push(action.data);
            return {
                        ...state,
                        tasks:{
                            ...state.tasks,
                            items:{
                                ...state.items,
                                [action.taskId]:{
                                    ...state.tasks.items[action.taskId],
                                    subTasks:state.tasks.items[action.taskId].subTasks.slice()
                                }
                            }
                        }
                    };
        case ERROR:
            return {
                    ...state,
                    ui:{
                        ...state.ui,
                        [action.type]:action.message
                    }
                };
        case ERROR_RECEIVING_TASK:
            delete state.tasks.items[action.id];
            return {
                    ...state,
                        tasks:{
                            ...state.tasks,
                            items:{
                                ...state.tasks.items
                            }
                        },
                        ui:{
                            ...state.ui,
                            taskFetchingError:action.message
                        }
                    };
        case ERROR_RECEIVING_TASKS:
            return {
                        ...state,
                        tasks:{
                            isLoading:false,
                            items:[]
                        },
                        ui:{
                            ...state.ui,
                            taskListFetchingError:action.message
                        }
                    };
    }
    return state;
}


export default rootReducer;