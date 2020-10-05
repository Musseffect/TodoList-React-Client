import { 
    ERROR
} from "../actions/actions";
import { 
    RECEIVE_SUBTASK,
    REMOVE_SUBTASK
} from "../actions/subTaskActions";
import { 
    REMOVE_TASK,
    REQUEST_TASKS,
    RECEIVE_TASKS,
    REQUEST_TASK,
    RECEIVE_TASK,
    ERROR_RECEIVING_TASK,
    ERROR_RECEIVING_TASKS, 
    UPDATE_TASK } from "../actions/taskActions";

var rootReducer = function(state,action){
    switch(action.type){
        case UPDATE_TASK:
            return {
                        ...state,
                        tasks:{
                            ...state.tasks,
                            items:{
                                ...state.tasks.items,
                                [action.id]:{
                                    ...state.tasks.items[action.id],
                                    ...action.data
                                }
                            }
                        }
                    };
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
                                [action.task.id]:{
                                    ...action.task,
                                    isLoading:false
                                },
                                ...state.tasks.items
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
        case REMOVE_SUBTASK:{
            let index = state.tasks.items[action.taskId].subTasks.findIndex((value)=>value.id==action.id);
            state.tasks.items[action.taskId].subTasks.splice(index,1);
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
                }
        case RECEIVE_SUBTASK:{
            let index = state.tasks.items[action.taskId].subTasks.findIndex((value)=>value.id==action.data.id);
            if(index==-1){
                state.tasks.items[action.taskId].subTasks.unshift(action.data);
            }else{
                state.tasks.items[action.taskId].subTasks[index] = action.data;
            }
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
                }
        case ERROR:
            return {
                    ...state,
                    ui:{
                        ...state.ui,
                        [action.errorType]:action.message
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