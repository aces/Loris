# LORIS-MRI Python guide

This document describes the LORIS-MRI Python architecture, with an emphasis on the foundational modules that can be used throughout the code to develop new features.

## Architecture

All the LORIS-MRI Python code, except for some configuration files, lives in the `python` directory. Inside this directory, the following subdirectories can be found:
- `scripts`: Contains the LORIS-MRI Python scripts, each file in this directory corresponds to a command that can be run with the appropriate parameters.
- `lib`: Contains the LORIS-MRI Python libraries, which are accessible by the scripts as the `lib` module and submodules.
- `tests`: Contains the LORIS-MRI Python unit and integration tests.

## Database

LORIS-MRI Python interacts extensively with the LORIS database. As such, several library abstractions have been developed to do so through the years. Some of these abstractions are deprecated, but not all the code has been moved yet to the newest abstraction.

### SQLAlchemy database abstraction

The SQLAlchemy database abstraction is the latest and preferred method to interract with the database in LORIS-MRI Python. As its name implies, it uses the SQLAlchemy 2 Python library, which is an ORM library that allows to map SQL tables with Python classes. Compared to the older database abstractions, it is notably statically typed and has a flexible module structure that separates models and queries.

#### Module organization

The code of the database abstraction is located in the `lib.db` module [^1].

There are several submodules in `lib.db`:
- `lib.db.models`: This module contains the SQLAlchemy models, which map SQL tables to Python classes.
- `lib.db.decorators`: This module contains a few SQLAlchemy type decorators, which allow to define custom conversions between some SQL types and Python types.
- `lib.db.queries`: This module contains the queries made using the SQLAlchemy abstraction.

[^1]: Ideally, we would prefer to use the `lib.database` module name, but that name is already taken by an older abstraction.

#### Model definitions

The SQLAlchemy models are defined in the `lib.db.models` module. Each file contains a single SQLAlchemy model that is linked to a given LORIS SQL table. A model file should be named `model_name.py` and a model class should be named `DbModelName`. A model describes the structure of its table and its relations with other models. Do not import model classes directly in other models as this can create cyclic dependencies that Python cannot handle.

An SQLAlchemy model and its attributes can be renamed compared to the LORIS SQL schema to adhere to the Python naming conventions, avoid repetitions, and provide a more consistent database abstraction.

There is an integration test to ensure the SQLAlchemy models remain synchronized with the LORIS SQL schema.

#### Query definitions

The SQLAlchemy queries are defined in the `lib.db.queries` module. This module is divided in submodules that group queries by theme (for instance `lib.db.queries.candidate` for candidate-related queries). **All the LORIS-MRI SQLAlchemy queries should go in `lib.db.queries`**, doing so allows to make queries more discoverable, reusable, and to isolate them from the rest of the code logic.

Each query should be encapsulated in a function that takes the database session and the query parameters as arguments, and returns the query results, `None`, or pass through the SQLAlchemy exception in case of error. The query functions should not contain any error handling, logging, transaction management, or complex logic. This work should be delegated to the caller.

When possible, queries should also be written in a generalized way that make them easily reusable by other parts of the code. For instance, it is often preferable for a query to return a whole model object instead of only some of its fields as different callers might be interested in different fields. Micro-optimization should be avoided unless a query is called in a particularly performance-sensitive section of the code.

Finally, model relations should be preferred to queries where they do not blow up the complexity of the code (such as in a nested loop).

#### Database session

SQLAlchemy uses the `sqlalchemy.orm.Session` object to communicate with the database. Usually, database session variables are named `db` and the SQLAlchemy `Session` is renamed to `Database` to not conflict with the LORIS concept of a session [^2].

Example:

```py
from sqlalchemy.orm import Session as Database

def foo(db: Database):
    return db.execute(...)
```

The changes made in a database session are not sent to the database until `db.flush()` or `db.commit()` is called. Be mindful of this behavior when reading database-populated fields such as auto-incremented numbers or before exiting a script.

Finally, a database session is **transactional**, that is, the changes made in a session are not visible by other sessions and do not persist in the database unless they are commited. Use `db.commit()` to commit the current changes or `db.rollback()` to discard them and go back to the latest database commit. There may be several database sessions living simultaneously to handle independent transactions.

[^2]: Code that interacts with advanced SQLAlchemy APIs should not use these renamings but instead stick to the SQLAlchemy naming convention.

#### Debugging

The [official SQLAlchemy documentation](https://docs.sqlalchemy.org/en/20/) provides an extensive (although sometimes a little imposing) description of the library. Be mindful of the differences between SQLAlchemy 1 and 2 when looking for information on SQLAlchemy online.

To get the raw SQL string generated by an SQLAlchemy ORM query, you can use `print(query)` or `str(query)`.

```py
query = select(DbCandidate.cand_id) \
    .join(DbCandidate.sessions) \
    .where(DbSession.visit_label == 'V3')

print(query)
# SELECT candidate."CandID"
# FROM candidate JOIN session ON candidate."CandID" = session."CandID"
# WHERE session."Visit_label" = :Visit_label_1

print(query.compile().params)
# {'Visit_label_1': 'V3'}
```

You can also use the keyword argument `echo=True` in the `create_engine` function to print all the queries sent to the database by SQLAlchemy.

### Database library (deprecated)

The `lib.database` and `lib.database_lib` modules contain some older database abstraction. It is deprecated and should not be used in new code.

### Raw queries (deprecated)

Some of the LORIS-MRI scripts use raw SQL queries in their code. This is deprecated and should not be used in new code.

## Tooling

### Virtual environment

LORIS-MRI uses a Python virtual environment to manage its execution context and dependencies. To activate the virtual environment, use the command `source environment` in the LORIS-MRI root directory. The dependencies of the virtual environment are listed in the `python/requirements.txt` file.

### Configuration

The LORIS-MRI Python tools are configured in the `pyproject.toml` file in the LORIS-MRI root directory.

### Linting

LORIS-MRI Python uses the Ruff linter to ensure a consistent coding style that adheres to the Python community guidelines.

To run Ruff, use the following commands in the LORIS-MRI root directory:
* `ruff check` to run the linter and report style errors.
* `ruff check --fix` to automatically fix trivial linting errors such as unsorted imports.

### Type checking

LORIS-MRI Python uses type hints and the Pyright type checker [^3] to improve the robustness and maintainability of the code.

To run Pyright, use the following commands in the LORIS-MRI root directory:
* `pyright` to run the strict type checker, which type checks modern LORIS-MRI Python type-hinted modules with a strict configuration.
* `pyright --project test` to run the global type checker, which type checks all the LORIS-MRI Python modules including untyped legacy code with a (very) loose configuration.

When interacting with legacy code or untyped libraries in modern modules, you can use `# type: ignore` or `cast(type, value)` to ignore type checking errors.

[^3]: Although we use Pyright, Mypy is also an excellent alternative type checker.

### Testing

LORIS-MRI Python uses the Pytest library to handle unit and integration tests.

#### Unit testing

The LORIS-MRI Python unit tests are located in the `python/tests/unit` directory.

To run the LORIS-MRI Python unit tests, use the command `pytest` in the root LORIS-MRI directory.

#### Integration testing

The LORIS-MRI integration tests are located in the `python/tests/integration` directory.

The LORIS-MRI integration tests require a more complex testing environment with the following:
- A copy of the main LORIS repository.
- A file system mount of the S3 LORIS-MRI test dataset.
- A LORIS database Docker image with the LORIS-MRI test dataset.
- A LORIS-MRI code Docker image with all the required dependencies installed.

To run the LORIS-MRI integration tests, use the command `pytest python/tests/integration` in the root LORIS-MRI directory **inside the LORIS-MRI code Docker image**.

As of December 2024, there is no easy way to set up and run this environment locally. You can however use the LORIS-MRI GitHub Actions workflow (that is, create a pull request) to set up this environment and run the integration tests in GitHub.
