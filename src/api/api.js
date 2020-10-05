

const taskResource = "http://localhost:8080/api/tasks";

const api = {
    fetchTask:function(id,token){
        return fetch(`${taskResource}/${id}`,{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
    },
    fetchTaskList:function(token){
        return fetch(taskResource,{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
    },
    updateTask:function(id,data,token){
        return fetch(`${taskResource}/${id}`,{
            method:'PUT',
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body:JSON.stringify(data)
        });
    },
    updateSubTask:function(taskId,id,data,token){
        return fetch(`${taskResource}/${taskId}/subtasks/${id}`,{
            method:'PUT',
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body:JSON.stringify(data)
        });
    },
    removeTask:function(id,token){
        return fetch(`${taskResource}/${id}`,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
    },
    removeSubTask:function(taskId,id,token){
        return fetch(`${taskResource}/${taskId}/subtasks/${id}`,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
    },
    addTask:function(data,token){
        return fetch(taskResource,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body:JSON.stringify(data)
        });
    },
    addSubTask:function(taskId,data,token){
        return fetch(`${taskResource}/${taskId}/subtasks/`,{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body:JSON.stringify(data)
        });
    }
};

export default api;