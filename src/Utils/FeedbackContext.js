import React from 'react'
import Alert from './Alert'

export const FeedbackContext = React.createContext({
  feedbacks: [],
  setFeedbacks: () => {},
  pushFeedback: () => {}
})

export default function Context (props) {
  const [feedbacks, setFeedbacks] = React.useState([])
  const pushFeedback = (newFeedback) => {
    setFeedbacks([...feedbacks, newFeedback])
    feedbacks.push(newFeedback)
  }
  return <FeedbackContext.Provider value={{ feedbacks, setFeedbacks, pushFeedback }}>
    {props.children}
    <FeedbackContext.Consumer>
      {({ feedbacks, setFeedbacks }) =>
        <Alert
          open={!!feedbacks.length}
          onClose={() => setFeedbacks([])}
          autoHideDuration={6000}
          alerts={feedbacks.map((f, idx) => ({
            ...f,
            onClose: () => setFeedbacks([...feedbacks.slice(0, idx), ...feedbacks.slice(idx + 1)])
          }))}
        />
      }
    </FeedbackContext.Consumer>
  </FeedbackContext.Provider>
}
