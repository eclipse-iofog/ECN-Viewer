import React from 'react'
import Alert from './Alert'

export const FeedbackContext = React.useContext({
  feedbacks: [],
  setFeedbacks: () => {}
})

export default function Context (props) {
  const [feedbacks, setFeedbacks] = React.useState([])
  return <FeedbackContext.Provider value={{ feedbacks, setFeedbacks }}>
    {props.children}
    <FeedbackContext.Consumer>
      {({ feedbacks, setFeedbacks }) =>
        <Alert
          open={!!feedbacks.length}
          onClose={() => setFeedbacks([])}
          autoHideDuration={6000}
          alerts={feedbacks}
        />
      }
    </FeedbackContext.Consumer>
  </FeedbackContext.Provider>
}
