---
title: Shouldly
by: Andreas Fuller 
status: draft
---

### Galt Eller
## Genialt

# Shouldly

---

# Assert
```c#
var result = SomeService.DoSomething();
Assert.AreEqual("Expected result", result);
```

----

# Shouldly
```c#
var result = SomeService.DoSomething();
result.ShouldBe("ExpectedResult");
```

---

# Nullability
```c#
/// Assert
Assert.IsNotNull(result);
Assert.AreEqual(15, result?.Length); // or result!.Length

/// Shouldly
result
  .ShouldNotBeNull()
  .Length.ShouldBe(15);
```

----
# Collections
```c#
/// Assert
CollectionAssert.AreEqual(new [] { 1, 2, 3 }, result);

/// Shouldly
result.ShouldBe(new [] { 1, 2, 3 });
```

----
# Type checking
```c#
/// Assert
Assert.IsInstanceOf<User>(result);
Assert.AreEqual("Andreas", (result as User).Name);

/// Shouldly
result
  .ShouldBeOfType<User>()
  .Name.ShouldBe("Andreas");
```

----
# Typesafe
```c#
/// Assert
public static void AreEqual(
  ICollection? expected,
  IColection? actual
);

/// Shouldy
public static void Shouldbe<T>(this T actual, T expected);
```

----
# Extendable
```c#
/// Assert
public static class MyCustomAssert {
  public static void AreSequence<T>(
    IEnumerable<T> actual, params T[] expected);
}
MyCustomAssert.AreSequence(result, 1, 2, 3);

/// Shouldly
public static class ShouldlyEx {
  public static void ShouldBeSequence<T>(
    this IEnumerable<T> actual, params T[] expected);
}
result.ShouldBeSequence(1, 2, 3);
```