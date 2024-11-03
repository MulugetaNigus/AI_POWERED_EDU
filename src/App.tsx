import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
// import MarkdownDisplay from './components/MarkdownDisplay';
import ProtectedRoute from './components/ProtectedRoute';
import Apps from './quize_progress/Apps';

// Sample markdown text
const sampleMarkdown = `## Flutter: A Comprehensive Introduction

This is an excellent summary of Flutter and its key features, benefits, and components. It's well-structured and covers a wide range of topics, making it a valuable resource for anyone looking to learn Flutter.

Here's a breakdown of the main points, along with some additional insights:

**What is Flutter?**

* **Cross-platform framework:** Flutter allows you to build high-quality mobile apps for both Android and iOS using a single codebase.
* **High performance:**  Flutter renders UI directly onto the native platform's canvas, resulting in a faster, smoother experience compared to hybrid app frameworks.
* **Modern and reactive:** Flutter utilizes a reactive programming approach similar to ReactJS, making it easy to manage UI changes and state.
* **Rich widget library:** Flutter comes with a comprehensive set of ready-to-use widgets that conform to Material Design (Android) and Cupertino (iOS) guidelines, simplifying UI development.

**Benefits of using Flutter:**

* **Fast development:** Flutter's hot reload feature allows for rapid iteration and debugging.
* **Cost-effective:**  Developing for both platforms with a single codebase reduces development time and resources.      
* **Beautiful UI:** Flutter's widgets provide flexibility and customization options for creating visually appealing user interfaces.
* **High performance:** Apps built with Flutter are known for their smooth and responsive performance.

**Key components of Flutter:**

* **Widgets:** The core concept of Flutter – everything is a widget. Widgets are UI elements that are composed to build complex interfaces.
* **Layout Widgets:** Flutter provides various layout widgets for arranging widgets in different ways (e.g., Row, Column, Stack, Container).
* **State Management:** Flutter offers mechanisms like StatefulWidget and scoped_model for managing the dynamic state of your app.
* **Gestures:** Flutter provides GestureDetector and other gesture-related widgets for capturing and responding to user interactions.
* **Animation:** Flutter offers a robust animation system for creating engaging and visually appealing user experiences. 

**Beyond the basics:**

* **Platform-specific code:** Flutter allows developers to access platform-specific features through Message Channels, enabling integration with native SDKs (Android/iOS).
* **Packages and Plugins:** Flutter leverages a rich ecosystem of packages and plugins for extending functionality and reusing code.
* **REST APIs:**  Flutter provides the http package for efficiently consuming REST APIs and retrieving data from web servers.
* **Databases:** Flutter supports both local (SQLite) and cloud (Cloud Firestore) databases for data storage and retrieval.
* **Internationalization:**  Flutter provides mechanisms like Locale, Localizations, and intl package for localizing apps to support different languages.
* **Testing:** Flutter supports various types of testing, including Unit, Widget, and Integration testing, to ensure high-quality code.
* **Deployment:** Flutter simplifies deployment for both Android and iOS, enabling developers to publish their apps to Google Play Store and App Store.

**Key takeaway:**

Flutter is a powerful and rapidly evolving framework that offers a streamlined, efficient, and performant way to build beautiful and engaging mobile apps. It's a great choice for developers looking to create cross-platform applications with a modern and reactive approach.`;


function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path='/quize-and-progress' element={<Apps />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;