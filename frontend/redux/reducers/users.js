import { USERS_POSTS_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA } from "../constants"

const initalState = {
    users: [], 
    feed: [],
    usersFollowingLoaded: 0

}

export const users = ( state = initalState, action) => {
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return{
                ...state,
                users: [...state.users, action.user]
            }
        case USERS_POSTS_STATE_CHANGE:
            return{
                ...state,
                usersFollowingLoaded: state.usersFollowingLoaded + 1,
                feed: [...state.feed, ...action.posts]
                // users: state.users.map(user => user.uid === action.uid ? 
                //         {...user, posts: action.posts} :
                //         user
                //     )
            }
        case USERS_LIKES_STATE_CHANGE:
            return{
                ...state,
                feed: state.feed.map(post => post.id == action.postId ? 
                    {...post, currentUserLike: action.currentUserLike}:
                    post)
            }
        case CLEAR_DATA:
            return initalState
        default:
            return state;
    }
}