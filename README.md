# @viviengraffin/translation-core

Core library for the `@viviengraffin/translation-*` ecosystem.

`@viviengraffin/translation-core` provides the framework-agnostic foundation for building typed and extensible translation systems in JavaScript/TypeScript.

It contains the core translation logic, locale management, fallback handling, namespaces, translation loading, and internationalization utilities. Framework-specific packages can then build on top of this foundation to integrate translations into their own ecosystem.

## Architecture

The package is designed as a common foundation rather than a framework-specific integration.

```
                    @viviengraffin/translation-core
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
          TranslationBase               Internationalization
                    │
          ┌─────────┴─────────┐
          │                   │
 translation-react       other integrations
```

For example, @viviengraffin/translation-react extends the core translation system with React-specific behavior such as `ReactElement` translations, a provider, and the `useTranslation` hook.

This separation keeps the core independent from any particular framework while allowing integrations to reuse the same translation API and behavior.

## Features

### Translation management

[TranslationBase](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/TranslationBase) provides the main translation API:

- Translate keys from hierarchical translation objects.
- Pass data to dynamic translations.
- Safely resolve translations without throwing errors.
- Change the current locale.
- Replace or update loaded translations.
- Dynamically manage translation namespaces.

```ts
translation.translate("home.title");

translation.translate("welcome", {
  name: "John",
});

translation.safeTranslate("home.title");
```

## Locales and fallback locales

Locales are represented by [Locale](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/Locale) class and can be normalized using either dash or underscore separators.

```
fr-FR
FR_FR
```

The Translation system supports fallback locales, allowing a translation to be resolved from another locale when the requested one is unavailable.

The default fallback locale is `en`.

## Namespaces

Translations can be organized into namespaces and loaded selectively.

Namespaces can be added, removed, or replaced at rutime:

```ts
await translation.addNamespaces("common", "users");

await translation.removeNamespaces("users");

await translation.setNamespaces(["common"]);
```

[TranslationNamespaces](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/TranslationNamespaces) is responsible for managing the available namespaces and resolving the selected ones for a given set of locales.

## Translation loading

Translations can be loaded dynamically and asynchronously.

The core supports translation objects defined per locale and can resolve the appropriate translation objects according to the requested locale, fallback locale, and locale format.

This behavior is abstracted throught [EnvironmentBase](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/EnvironmentBase), allowing different environments to provide their own way of loading translations.

## Builder

[TranslationBuilder](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/TranslationBuilder) provides a fluent API for configuring and creating translation implementations.

```ts
const translater = await new TranslationBuilder(MyTranslation)
  .withEnvironment(Environment)
  .withLocale("fr-FR")
  .withFallbackLocale("en")
  .withTranslations(translations)
  .build();
```

The builder can configure:

- the current locale
- the fallback locale
- the locale format
- the translation key separator
- the environment
- the translations
- selected namespaces

## Internationalization

The core also provide [IntlFacade](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/IntlFacade), a unified interface around JavaScript's internalization APIs.

```ts
const intl = getIntlFacade("fr-FR");

intl.list(["Alice", "Bob", "Charlie"]);

intl.relative(-2, "day");
```

It exposes locale-aware utilities for:

- dates and times
- numbers
- lists
- pluralization
- relative time

This allows integrations to expose consistent internationalization behavior without depending directly on a specific framework.

## Translation objects

Translations use hierarchical objects, making it possible to organize keys by domain:

```ts
const translations = {
  "fr-FR": () => ({
    home: {
      title: "Accueil",
      description: "Bienvenue sur notre application",
    },
  }),

  en: () => ({
    home: {
      title: "Home",
      description: "Welcome to our application",
    },
  }),
};
```

Nested keys are resolved using `.` by default:

```ts
translater.translate("home.title");
```

The separator can be customize through the builder.

## Dynamic translations

A translation value can either be a static value of a function.

This makes it possible to create translations that depends on runtime data:

```ts
{
  welcome: ({ name }) => `Welcome ${name}!`
}
```

The exact return type is defined by the translation implementation, allowing framework integrations to determine how translations are represented.

For example, a React integration return `ReactElement` instances while another integration may simply return strings.

## Framework integrations

`translation-core` intentionnaly does not depend on a UI framework.

Framework-specific packages are responsible for adapting the core to their environment.

For example:

### React

`@viviengraffin/translation-react` provides React-specific functionality on top of `translation-core`:

- `TranslationReact`
- `TranslationReactProvider`
- `useTranslation`

The React implementation allows translation values to resolve `ReactElement` and provides the necessary React context integration.

Other integrations can be implement the same pattern while reusing the core translation and locale management logic.

## Core API

The main building blocks are:


| API | Purpose  |
| --- | ---  |
| [TranslationBase](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/TranslationBase) | Base implementation for translation systems |
| [TranslationBuilder](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/TranslationBuilder) | Builds and configures translation instances |
| [TranslationNamespaces](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/TranslationNamespaces) | Manage translation namespaces |
| [Locale](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/Locale) | Represents and normalizes locales |
| [EnvironmentBase](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/EnvironmentBase) | Defines translation loading behavior |
| [IntlFacade](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/IntlFacade) | Provides locale-aware internationalization utilities |
| [getIntlFacade](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/getIntlFacade) | Creates an [IntlFacade](https://jsr.io/@viviengraffin/translation-core/doc/backend/~/IntlFacade) for a locale |

Utility functions are also provided for locale conversion and unique arrays.

## Design goals

The core package is designed around a few principles:

- Framework agnostic : no dependency on a UI framework
- Extensible : integrations can customize how translations are represented and loaded
- Composable : transaltion loading, namespaces, locales, and formatting are independent concepts
- Shared behavior : framework integrations can rely on the same translation logic and conventions