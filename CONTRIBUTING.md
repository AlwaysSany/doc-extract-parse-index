# Contributing to doc-extract-parse-index

We welcome contributions to `doc-extract-parse-index`! By following these guidelines, you can help us make this project even better.

## Table of Contents

- [How to Contribute](#how-to-contribute)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Code Style](#code-style)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [ToDo's](#todos)
- [License](#license)

## How to Contribute

1.  **Fork the repository.**
2.  **Clone your forked repository** to your local machine:
    ```bash
    git clone <your-fork-url>
    cd doc-extract-parse-index
    ```
3.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/your-bug-fix
    ```
4.  **Make your changes.** Ensure your code adheres to the [Code Style](#code-style) guidelines.
5.  **Test your changes.** Refer to the [Testing](#testing) section.
6.  **Commit your changes** with a clear and concise commit message:
    ```bash
    git commit -m "feat: Add new feature" # or "fix: Fix a bug"
    ```
7.  **Push your branch** to your forked repository:
    ```bash
    git push origin feature/your-feature-name
    ```
8.  **Open a Pull Request** to the `main` branch of the original repository. Provide a detailed description of your changes.

## Setting Up Your Development Environment

Follow the [Setup Instructions](#setup-instructions) in the `README.md` to get your development environment ready.

## Code Style

- **Python (Backend):** Adhere to PEP 8 guidelines. Use a linter like Flake8 or Black.
- **JavaScript/TypeScript (Frontend):** Follow standard React best practices. Use a linter like ESLint.

## Testing

- Add unit tests for new features or bug fixes, especially for backend services.
- Run existing tests to ensure no regressions.

## Reporting Bugs

If you find a bug, please open an issue on the [GitHub Issues](https://github.com/example/doc-extract-parse-index/issues) page. Include:
- A clear and concise description of the bug.
- Steps to reproduce the behavior.
- Expected behavior.
- Screenshots if applicable.
- Your environment details (OS, Python version, Node.js version, etc.).

## Suggesting Enhancements

For feature requests or enhancements, please open an issue on [GitHub Issues](https://github.com/example/doc-extract-parse-index/issues). Describe:
- The proposed enhancement.
- Why it would be beneficial to the project.
- Any potential alternatives.

## ToDo's

Here's a list of current tasks that contributors can pick up (from `README.md`):

- [ ] Use LlamaCloud to index uploaded documents.
- [ ] Implement advanced search features using LlamaCloud on indexed documents.
- [ ] Add unit tests for backend services.
- [ ] Improve frontend UI/UX.
- [ ] Add more document format support (e.g., PDF, DOCX).
- [ ] Implement user authentication and authorization.
- [ ] Optimize performance for large document sets.
- [ ] Add error handling and logging.
- [ ] Create comprehensive documentation for API endpoints.
- [ ] Set up CI/CD pipeline for automated testing and deployment.
- [ ] Implement rate limiting and security measures for the API.
- [ ] Add support for multiple languages in document processing.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details. 