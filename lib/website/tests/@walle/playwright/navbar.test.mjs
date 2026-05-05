import { chromium } from "playwright";

const BASE = "http://localhost:4322/walle-design-system";

async function testNavbar() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  // --- Desktop test (1280x800) ---
  console.log("\n=== DESKTOP (1280x800) ===");
  const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(BASE, { waitUntil: "networkidle" });

  // Check navbar is visible
  const navbar = await desktopPage.locator("nav.main-nav");
  const navVisible = await navbar.isVisible();
  console.log(`[✓] Navbar visible: ${navVisible}`);
  results.push({ test: "Desktop navbar visible", pass: navVisible });

  // Check nav links are visible (not behind hamburger)
  const navLinks = desktopPage.locator(".nav-links");
  const navLinksVisible = await navLinks.isVisible();
  console.log(`[✓] Nav links visible (no hamburger): ${navLinksVisible}`);
  results.push({ test: "Desktop nav links visible", pass: navLinksVisible });

  // Hover over dropdown trigger (Blog)
  const blogTrigger = desktopPage.locator(".dropdown-trigger").first();
  await blogTrigger.hover();
  await desktopPage.waitForTimeout(400);

  // Check dropdown is visible
  const dropdown = desktopPage.locator(".dropdown-menu").first();
  const dropdownVisible = await dropdown.isVisible();
  console.log(`[✓] Dropdown visible on hover: ${dropdownVisible}`);
  results.push({ test: "Desktop dropdown visible on hover", pass: dropdownVisible });

  // Check dropdown does NOT overflow the viewport
  const dropdownBox = await dropdown.boundingBox();
  const viewportWidth = 1280;
  if (dropdownBox) {
    const overflowsRight = dropdownBox.x + dropdownBox.width > viewportWidth;
    const overflowsLeft = dropdownBox.x < 0;
    console.log(
      `[✓] Dropdown box: x=${dropdownBox.x.toFixed(0)}, width=${dropdownBox.width.toFixed(0)}, right=${(dropdownBox.x + dropdownBox.width).toFixed(0)}`
    );
    console.log(`[✓] Overflows right: ${overflowsRight}, Overflows left: ${overflowsLeft}`);
    results.push({ test: "Desktop dropdown no right overflow", pass: !overflowsRight });
    results.push({ test: "Desktop dropdown no left overflow", pass: !overflowsLeft });
  } else {
    console.log(`[✗] Could not get dropdown bounding box`);
    results.push({ test: "Desktop dropdown bounding box", pass: false });
  }

  // Check dropdown items are clickable
  const dropdownItems = dropdown.locator(".dropdown-link");
  const itemCount = await dropdownItems.count();
  console.log(`[✓] Dropdown items count: ${itemCount}`);
  results.push({ test: "Desktop dropdown has items", pass: itemCount > 0 });

  await desktopCtx.close();

  // --- Mobile test (375x667 - iPhone SE) ---
  console.log("\n=== MOBILE (375x667) ===");
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(BASE, { waitUntil: "networkidle" });

  // Hamburger should be visible
  const hamburger = mobilePage.locator("#mobile-menu-toggle");
  const hamburgerVisible = await hamburger.isVisible();
  console.log(`[✓] Hamburger visible: ${hamburgerVisible}`);
  results.push({ test: "Mobile hamburger visible", pass: hamburgerVisible });

  // Nav container should be hidden initially
  const mobileNavContainer = mobilePage.locator(".nav-container");
  const mobileNavHidden = !(await mobileNavContainer.isVisible());
  console.log(`[✓] Nav container hidden initially: ${mobileNavHidden}`);
  results.push({ test: "Mobile nav hidden initially", pass: mobileNavHidden });

  // Click hamburger to open menu
  await hamburger.click();
  await mobilePage.waitForTimeout(400);

  const mobileNavShown = await mobileNavContainer.isVisible();
  console.log(`[✓] Nav container visible after click: ${mobileNavShown}`);
  results.push({ test: "Mobile nav visible after hamburger click", pass: mobileNavShown });

  // Check that nav items don't overflow horizontally
  const mobileNavLinks = mobilePage.locator(".nav-links");
  const navLinksBox = await mobileNavLinks.boundingBox();
  if (navLinksBox) {
    const mobileOverflow = navLinksBox.x + navLinksBox.width > 375;
    console.log(
      `[✓] Mobile nav links box: x=${navLinksBox.x.toFixed(0)}, width=${navLinksBox.width.toFixed(0)}, right=${(navLinksBox.x + navLinksBox.width).toFixed(0)}`
    );
    console.log(`[✓] Mobile nav overflows viewport: ${mobileOverflow}`);
    results.push({ test: "Mobile nav no overflow", pass: !mobileOverflow });
  }

  // Click Blog dropdown trigger on mobile
  const mobileBlogTrigger = mobilePage.locator(".dropdown-trigger").first();
  await mobileBlogTrigger.click();
  await mobilePage.waitForTimeout(400);

  // Check dropdown items are visible on mobile
  const mobileDropdown = mobilePage.locator(".dropdown-menu").first();
  const mobileDropdownVisible = await mobileDropdown.isVisible();
  console.log(`[✓] Mobile dropdown visible after click: ${mobileDropdownVisible}`);
  results.push({ test: "Mobile dropdown visible after click", pass: mobileDropdownVisible });

  // Check no horizontal overflow on dropdown items
  if (mobileDropdownVisible) {
    const mDropdownBox = await mobileDropdown.boundingBox();
    if (mDropdownBox) {
      const mOverflow = mDropdownBox.x + mDropdownBox.width > 375;
      console.log(
        `[✓] Mobile dropdown box: x=${mDropdownBox.x.toFixed(0)}, width=${mDropdownBox.width.toFixed(0)}, right=${(mDropdownBox.x + mDropdownBox.width).toFixed(0)}`
      );
      results.push({ test: "Mobile dropdown no overflow", pass: !mOverflow });
    }
  }

  await mobileCtx.close();

  // --- Tablet test (768x1024) ---
  console.log("\n=== TABLET (768x1024) ===");
  const tabletCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const tabletPage = await tabletCtx.newPage();
  await tabletPage.goto(BASE, { waitUntil: "networkidle" });

  // At 768px, hamburger should show (breakpoint is max-width: 768px)
  const tabletHamburger = tabletPage.locator("#mobile-menu-toggle");
  const tabletHamburgerVisible = await tabletHamburger.isVisible();
  console.log(`[✓] Tablet hamburger visible: ${tabletHamburgerVisible}`);
  results.push({ test: "Tablet hamburger visible", pass: tabletHamburgerVisible });

  await tabletCtx.close();
  await browser.close();

  // --- Summary ---
  console.log("\n=== SUMMARY ===");
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`Passed: ${passed}, Failed: ${failed}, Total: ${results.length}`);

  if (failed > 0) {
    console.log("\nFailed tests:");
    results.filter((r) => !r.pass).forEach((r) => console.log(`  ✗ ${r.test}`));
    process.exit(1);
  }

  console.log("\n✅ All navbar tests passed!");
}

testNavbar().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
