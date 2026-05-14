# Allman Braces

Automatically expands inline curly braces to **Allman style** when pressing `Enter`.

## What it does

When your cursor is between `{` and `}` and you press `Enter`, this:

```c
myFunction(){}
```

becomes:

```c
myFunction()
{

}
```

The cursor is placed on the empty line inside the braces, ready to type.

## Why Allman?

Allman style places the opening brace on its own line, making block structure visually clear. It's widely used in C, C++, C# and similar languages.

## Usage

1. Place your cursor between `{` and `}`
2. Press `Enter`
3. Done

Works with any indentation level:

```c
if (condition){}  →  if (condition)
                     {
                     
                     }
```

## Extension Settings

No configuration needed. Works out of the box.

## Known Issues

None reported yet. Found one? Open an issue on [GitHub](https://github.com/L1ROO/allman-braces).

## Release Notes

### 0.0.1
Initial release.