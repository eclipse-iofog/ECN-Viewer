import React from 'react'
import Alert from './Alert'

export const FeedbackContext = React.createContext({
  feedbacks: [],
  setFeedbacks: () => {},
  pushFeedback: () => {}
})

const AUTO_HIDE = 6000

export default function Context (props) {
  const [feedbacks, setFeedbacks] = React.useState([])
  const pushFeedback = (newFeedback) => {
    setFeedbacks([...feedbacks, newFeedback])
    // Update current feedback array (same array will be used if multiple calls to pushFeedback in the same render loop)
    feedbacks.push(newFeedback)
  }
  return <FeedbackContext.Provider value={{ feedbacks, setFeedbacks, pushFeedback }}>
    {props.children}
    <FeedbackContext.Consumer>
      {({ feedbacks, setFeedbacks }) =>
        <Alert
          open={!!feedbacks.length}
          onClose={() => setFeedbacks([])}
          autoHideDuration={AUTO_HIDE}
          alerts={feedbacks.map((f, idx) => ({
            ...f,
            onClose: (currentFeedbacks, currentIdx) => setFeedbacks([...currentFeedbacks.slice(0, currentIdx), ...currentFeedbacks.slice(currentIdx + 1)])
          }))}
        />
      }
    </FeedbackContext.Consumer>
  </FeedbackContext.Provider>
}
