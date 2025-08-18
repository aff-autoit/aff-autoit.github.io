---
title: Result
by: Andreas Fuller 
status: draft
---

# Constructing Results
## Result 1.0
```c#
public static Result<Date> ParseDate(string str) {
  if (/* Can parse */) {
    return Result<Date>.Success(new Date(str));
  }
  return Result<Date>.Failure(ErrorFactory.Validation(...));
}
```

----
# Constructing Results
## Result 2.0-rc1
```c#
public static Result<Date> ParseDate(string str) {
  if (/* Can parse */) {
    return Result.Success(new Date(str))
  }
  return Result.Failure(ErrorFactory.Validation(...))
}
```

----
# Constructing Results
## Result 2.0-rc2
```c#
public static Result<Date> ParseDate(string str) {
  if (/* Can parse */) {
    return new Date(str)
  }
  return ErrorFactory.Validation(...)
}
```

---
# Consuming Results
## Result 1.0
```c#
public static void Excecute() {
  var d1 = Parse("...");

  if (now.IsFailure) {
    var d2 = Parse("...");
    var d3 = Parse("...");
    var combined = Result.Combine(d2, d3);
    if (combined.IsFailure) {
      Console.WriteLine(combined.ToString())
    } else {
      Console.WriteLine(d2.Value!.ToString(), d3.Value!.ToString());
    }
  } else {
    Console.Writeline(d1.Value!.ToString());
  }
}
```

----
# Consuming Results
## Result 2.0-rc3 (type checking)
```c#
public static void Excecute() {
  var d1 = Parse("...");

  if (d1 is IFailure) {
    var d2 = Parse("...");
    var d3 = Parse("...");
    var combined = Result.Combine(d2, d3);
    if (combined.IsFailure) {
      Console.WriteLine(combined.ErrorsToString())
    } else {
      Console.WriteLine(d2.Value!.ToString(), d3.Value!.ToString());
    }
  } else if (d1 is Success<Date> { Value }) {
    Console.Writeline(Value.ToString());
  }
}
```