// Action Types
const ADD_MATCH = 'scoreboard/add-match'
const DELETE_MATCH = 'scoreboard/delete-match'
const RESET_BOARD = 'scoreboard/reset'
const INCREMENT = 'scoreboard/increment'
const DECREMENT = 'scoreboard/decrement'


// Action Creators
const addMatch = () => {
    return {
        type : ADD_MATCH,
    }
}

const deleteMatch = (matchId) => {
    return {
        type : DELETE_MATCH,
        payload: { id: matchId }
    }
}


const resetBoard = () => {
    return {
        type : RESET_BOARD,
    }
}


const increment = (value, matchId) => {
    return {
        type : INCREMENT,
        payload: {
            value: value,
            id: matchId
        },
    }
}


const decrement = (value, matchId) => {
    return {
        type : DECREMENT,
        payload: {
            value: value,
            id: matchId
        },
    }
}




// Initial State
const singleMatch = {
        id: 1,
        score: 0,
    }

const initialState = [singleMatch]



// Reducer Logic
const addMatchReducerLogic = (state, action) => {

    const lastInsertedId = (() => {
        let maxId = 0;

        state.forEach(match => {
            if(match.id > maxId) maxId = match.id
        })

        return maxId;
    })()

    const newMatch = {...singleMatch, id: lastInsertedId + 1};

    return [...state, newMatch]

}


const deleteMatchReducerLogic = (state, action) => {
    return state.filter(match => match.id !== action.payload.id);
}


const resetBoardReducerLogic = (state, action) => {
    return state.map(match => ({...match, score: 0}));
}


const incrementMatchValueReducerLogic = (state, action) => {
    return state.map(match => {
        if(match.id === action.payload.id){
            let updatedScore = match.score + action.payload.value
            if(updatedScore < 0) updatedScore = 0;
            return {...match, score: updatedScore}
        }
        return match;
    })
}


const decrementMatchValueReducerLogic = (state, action) => {
    return state.map(match => {
        if(match.id === action.payload.id) {
            let updatedScore = match.score - action.payload.value
            if(updatedScore < 0) updatedScore = 0;
            return {...match, score: updatedScore}
        }
        return match;
    })
}


const scoreBoardReducer = (state = initialState, action) => {

    switch(action.type){
        case ADD_MATCH : return addMatchReducerLogic(state, action)
        case DELETE_MATCH: return deleteMatchReducerLogic(state, action)
        case RESET_BOARD:  return resetBoardReducerLogic(state, action)
        case INCREMENT: return incrementMatchValueReducerLogic(state, action)
        case DECREMENT: return decrementMatchValueReducerLogic(state, action)
        default : return state;
    }

}





const store = Redux.createStore(scoreBoardReducer);


// Dom String
const matchContainer = document.querySelector('.all-matches');
const addMatchButton = document.querySelector('.lws-addMatch');
const resetBoardButton = document.querySelector('.lws-reset');




// Handeler
const incrementHandeler = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('.lws-increment')
    const incrementValue = parseInt(input.value)
    const matchId = parseInt(input.id)
    store.dispatch(increment(incrementValue, matchId))
}


const decrementHandeler = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('.lws-decrement')
    const decrementValue = parseInt(input.value);
    const matchId = parseInt(input.id);
    store.dispatch(decrement(decrementValue, matchId))    
}

const matchDeleteHandeler = (e) => {
    const id = parseInt(e.target.dataset.match)
    store.dispatch(deleteMatch(id));
}


const addMatchHandeler = (e) => {
    store.dispatch(addMatch())
}


const resetBoardhandeler = (e) => {
    store.dispatch(resetBoard())
}



const attachEvent = () => {

    const matchDeleteButtons = Array.from(document.querySelectorAll('.lws-delete'));
    const scoreIncrementForms = Array.from(document.querySelectorAll('.incrementForm'));
    const scoreDecrementsForms = Array.from(document.querySelectorAll('.decrementForm'));


    scoreIncrementForms.forEach(form => {
        form.addEventListener('submit', incrementHandeler)
    })

    scoreDecrementsForms.forEach(form => {
        form.addEventListener('submit', decrementHandeler)
    })

    matchDeleteButtons.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', matchDeleteHandeler)
    })

    addMatchButton.addEventListener('click', addMatchHandeler)

    resetBoardButton.addEventListener('click', resetBoardhandeler)

}

const render = () => {

    let allMatchesMarkup = '';

    store.getState().forEach((match, index) => {

        allMatchesMarkup +=   `<div class="match">
                                    <div class="wrapper">
                                        <button class="lws-delete" >
                                            <img src="./image/delete.svg" alt="" data-match="${match.id}" />
                                        </button>
                                        <h3 class="lws-matchName">Match ${index + 1}</h3>
                                    </div>
                                    <div class="inc-dec">
                                        <form class="incrementForm">
                                            <h4>Increment</h4>
                                            <input
                                                type="number"
                                                name="increment"
                                                class="lws-increment"
                                                id="${match.id}"
                                            />
                                        </form>
                                        <form class="decrementForm">
                                            <h4>Decrement</h4>
                                            <input
                                                type="number"
                                                name="decrement"
                                                class="lws-decrement"
                                                id="${match.id}"
                                            />
                                        </form>
                                    </div>
                                    <div class="numbers">
                                        <h2 class="lws-singleResult">${match.score}</h2>
                                    </div>
                                </div>`
    })


    matchContainer.innerHTML = allMatchesMarkup;
    attachEvent()


}

render()

store.subscribe(render);

