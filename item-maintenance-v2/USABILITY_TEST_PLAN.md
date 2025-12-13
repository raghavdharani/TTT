# Usability Test Plan: Item Maintenance V2

**Document Version:** 1.0  
**Last Updated:** 2025-01-11  
**Status:** Ready for Execution

---

## 📋 Executive Summary

This usability test plan is designed to validate Item Maintenance V2 with a focus on **time savings** (primary success metric) and addressing legacy system pain points. The plan includes:

- **Participants:** 5 Merchandising Managers/Buyers (Intermediate with legacy, Novice with web apps)
- **Sessions:** 3 focused 30-minute sessions
- **Methodology:** Hybrid (mix of moderated and unmoderated)
- **Dataset:** Large (1000+ items) to test performance
- **Priorities:**
  1. Filter application and management
  2. Bulk operations (Copy, Fill, Percentage)
  3. Search & Discovery workflow
  4. Inline editing and pending changes

**Key Focus Areas:**
- ✅ **Time Savings** - Primary success metric (compare to legacy)
- ✅ **All Fields Available** - Address legacy pain point (all 35 columns accessible)
- ✅ **UI Usability** - Address legacy pain point (UI not painful)
- ✅ **Large Dataset Performance** - Test with 1000+ items

**Business Scenarios:**
- Update prices for Spring collection
- Bulk edit vendor information

---

## 📋 Pre-Test Clarifying Questions - ANSWERS

### 1. **Target Users & Testing Participants**
- **Q1:** Who are the primary test participants?
  - ✅ **Answer:** Merchandising Managers, Buyers

- **Q2:** What is their experience level with:
  - Current legacy item maintenance system? ✅ **Answer:** Intermediate
  - Similar data management tools? ✅ **Answer:** Novice
  - Web applications in general? ✅ **Answer:** Novice

### 2. **Testing Objectives & Priorities**
- **Q3:** What are the top 3-5 features/flows you want to validate most critically?
  - ✅ **Priority 1:** Filter application and management
  - ✅ **Priority 1:** Bulk operations (Copy, Fill, Percentage operations)
  - ✅ **Priority 2:** Search & Discovery workflow
  - ✅ **Priority 3:** Inline editing and pending changes workflow
  - [ ] Vendor mode switching (Primary vs Secondary)
  - [ ] Saved sessions functionality
  - [ ] Column customization and reordering
  - [ ] Navigation guard (unsaved changes warning)

- **Q4:** Are there any known pain points from the legacy system that we should specifically test?
  - ✅ **Answer:** Not all fields are available in results, UI is painful

- **Q5:** What would constitute a "successful" test?
  - ✅ **Answer:** Time saving (primary success metric)

### 3. **Testing Environment & Methodology**
- **Q6:** What testing methodology do you prefer?
  - ✅ **Answer:** Hybrid (mix of both)

- **Q7:** Where will testing take place?
  - ✅ **Answer:** In-person (lab/office)
  - ✅ **Answer:** Asynchronous (user records themselves)

- **Q8:** How long should each test session be?
  - ✅ **Answer:** 30 minutes

- **Q9:** How many participants?
  - ✅ **Answer:** 5 participants

### 4. **Data & Scenarios**
- **Q10:** Do you have realistic test data/scenarios ready, or should we create mock scenarios?
  - ✅ **Answer:** No (we will create mock scenarios)

- **Q11:** Should we test with:
  - ✅ **Answer:** Large dataset (1000+ items) to test performance

- **Q12:** Are there specific business scenarios we should simulate?
  - ✅ **Answer:** Yes - "Update prices for Spring collection"
  - ✅ **Answer:** Yes - "Bulk edit vendor information"

### 5. **Success Metrics**
- **Q13:** What metrics should we track?
  - ✅ Time to complete tasks (seconds/minutes) - **PRIMARY METRIC**
  - ✅ Number of errors/assists needed
  - ✅ User satisfaction (1-5 scale)
  - ✅ System Usability Scale (SUS) score

- **Q14:** What's the acceptable error rate?
  - ✅ **Answer:** <10% critical errors

---

## 🎯 Prioritized Test Plan (30-Minute Sessions)

Based on your priorities, this test plan is organized into **3 focused 30-minute sessions** that can be run with 5 participants each. Each session focuses on the highest priority features while addressing the legacy pain points.

### **Session Structure**
- **Session 1 (30 min):** Filter Application & Search Discovery (Priority 1 & 2)
- **Session 2 (30 min):** Bulk Operations & Business Scenarios (Priority 1)
- **Session 3 (30 min):** Inline Editing & Complete Workflows (Priority 3)

### **Key Focus Areas**
1. **Time Savings** - Primary success metric (compare to legacy system)
2. **All Fields Available** - Address legacy pain point (test that all 35 columns are accessible)
3. **UI Usability** - Address legacy pain point (test that UI is intuitive and not painful)
4. **Large Dataset Performance** - Test with 1000+ items

---

## 🎯 Test Cases (Prioritized & Customized)

### **Test Suite 1: Search & Discovery**

#### **TC-1.1: Basic Quick Search**
**Objective:** Validate that users can quickly find items using the global search bar.

**Task:** "Find all items that contain 'T-Shirt' in their description or SKU."

**Steps:**
1. User opens the application
2. User types "T-Shirt" in the global search bar
3. User presses Enter or clicks search
4. User reviews results

**Success Criteria:**
- ✅ Search executes within 3 seconds
- ✅ Results display relevant items containing "T-Shirt"
- ✅ Record count is displayed
- ✅ No errors occur

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-1.2: Filter Panel Discovery & Usage**
**Objective:** Validate that users can discover and use the filter panel.

**Task:** "Find all items in Department '01' that were created in the last 30 days."

**Steps:**
1. User opens/clicks the Filter button
2. User expands the "Hierarchy" section
3. User selects Department "01" from dropdown
4. User expands the "Dates" section
5. User clicks "Last 30 Days" preset button
6. User clicks "Apply Filters"
7. User reviews results

**Success Criteria:**
- ✅ Filter panel opens/closes smoothly
- ✅ Sections expand/collapse correctly
- ✅ Filters apply correctly
- ✅ Active filters display as badges
- ✅ Results match criteria

**Metrics:**
- Time to complete: ___ seconds
- Clicks to complete: ___ (count)
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-1.3: Multiple Filter Combination**
**Objective:** Validate complex filter combinations.

**Task:** "Find all Active items from Vendor A with retail price between $20 and $50, created in the last 90 days."

**Steps:**
1. User opens filter panel
2. User sets Vendor filter to "Vendor A"
3. User sets Status filter to "Active"
4. User sets Retail Price min: $20, max: $50
5. User sets Creation Date to "Last 90 Days"
6. User applies filters
7. User reviews results

**Success Criteria:**
- ✅ All filters apply correctly
- ✅ Active filters show all applied criteria
- ✅ Results match all criteria
- ✅ No performance degradation

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-1.4: Filter Removal**
**Objective:** Validate that users can easily remove individual filters.

**Task:** "Remove the Vendor filter while keeping other filters active."

**Steps:**
1. User has multiple filters applied (visible in Active Filters bar)
2. User clicks the × button on the "Vendor: Vendor A" badge
3. User observes results update

**Success Criteria:**
- ✅ Filter badge disappears
- ✅ Results update automatically
- ✅ Other filters remain active
- ✅ No errors occur

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-1.5: Filter Reset**
**Objective:** Validate the Reset Filters functionality.

**Task:** "Clear all filters and start a new search."

**Steps:**
1. User has multiple filters applied
2. User clicks "Reset" button in filter panel
3. User observes all filters clear
4. User observes results reset

**Success Criteria:**
- ✅ All filter inputs clear
- ✅ All active filter badges disappear
- ✅ Results reset to default/empty state
- ✅ No errors occur

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

### **Test Suite 2: Results Grid & Data Display**

#### **TC-2.1: Column Visibility Toggle**
**Objective:** Validate column customization (show/hide columns).

**Task:** "Hide the 'UPC' column and show the 'Size' column if it's hidden."

**Steps:**
1. User views results grid
2. User opens column customizer (gear icon or similar)
3. User unchecks "UPC" column
4. User checks "Size" column if unchecked
5. User closes customizer
6. User observes column changes

**Success Criteria:**
- ✅ Column customizer opens/closes smoothly
- ✅ Checkbox states update correctly
- ✅ Columns hide/show immediately
- ✅ Changes persist (refresh page to verify)

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-2.2: Column Reordering**
**Objective:** Validate drag-and-drop column reordering.

**Task:** "Move the 'Description' column to be the second column (after Style)."

**Steps:**
1. User views results grid
2. User drags "Description" column header
3. User drops it after "Style" column
4. User observes column order change

**Success Criteria:**
- ✅ Drag operation is smooth
- ✅ Visual feedback during drag (ghost/preview)
- ✅ Column reorders correctly
- ✅ Changes persist (refresh page to verify)

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-2.3: Sorting Results**
**Objective:** Validate sorting functionality.

**Task:** "Sort results by Last Modified Date in descending order (newest first)."

**Steps:**
1. User views results grid
2. User opens sort controls
3. User selects "Last Modified" as sort field
4. User selects "Descending" as direction
5. User observes results re-sort

**Success Criteria:**
- ✅ Sort controls are discoverable
- ✅ Sort applies correctly
- ✅ Results reorder immediately
- ✅ Visual indicator shows active sort

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-2.4: All Fields Available in Results (Legacy Pain Point)**
**Objective:** Validate that ALL 35 standard fields are available in the results table (addressing legacy pain point).

**Task:** "Verify that you can see and access all item fields in the results table, including: UPC, First Digits, Vendor, Style, Color Name, Vendor Color, Size, Description, POS Description, First Cost, Wholesale Cost, Retail Price, Markdown Price, Markdown Date, Outlet Price, Outlet Markdown, Outlet Markdown Date, Department, Class, Sub-Class, Sub Dept, Attribute 1-3, Season, Prepack, Last Modified, Alt Style/SKU, Active Code, Status, Available On Web, Stat 3, Item Picture, Employee Price, Web Back Order Eligible."

**Steps:**
1. User views results grid
2. User opens column customizer
3. User reviews list of available columns
4. User verifies all 35 standard columns are listed
5. User enables all columns to view them
6. User scrolls horizontally to verify all columns are accessible

**Success Criteria:**
- ✅ All 35 standard columns are available in column customizer
- ✅ All columns can be enabled/displayed
- ✅ No missing fields compared to legacy system
- ✅ User can access all fields without leaving the results view
- ✅ UI is clear and not painful to navigate (addressing legacy pain point)

**Metrics:**
- Time to verify all fields: ___ seconds
- Missing fields: ___ (count) - should be 0
- User satisfaction with field availability: ___ / 5
- Comparison to legacy: "Better" / "Same" / "Worse"

---

### **Test Suite 3: Inline Editing**

#### **TC-3.1: Basic Cell Editing**
**Objective:** Validate basic inline cell editing.

**Task:** "Change the retail price of the first item from $29.99 to $34.99."

**Steps:**
1. User views results grid
2. User double-clicks (or clicks) on a retail price cell
3. User edits the value to $34.99
4. User presses Enter or clicks outside
5. User observes cell highlight (yellow) indicating pending change

**Success Criteria:**
- ✅ Cell becomes editable
- ✅ Value updates correctly
- ✅ Cell highlights with yellow background
- ✅ Change is tracked as "pending"
- ✅ No errors occur

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-3.2: Multiple Cell Edits**
**Objective:** Validate editing multiple cells before saving.

**Task:** "Edit the retail price, wholesale price, and status of the first 3 items, then review all changes."

**Steps:**
1. User edits retail price of item 1
2. User edits wholesale price of item 1
3. User edits status of item 1
4. User repeats for items 2 and 3
5. User reviews pending changes bar (shows count)
6. User observes all edited cells highlighted

**Success Criteria:**
- ✅ All edits are tracked
- ✅ Pending changes count is accurate
- ✅ All edited cells are highlighted
- ✅ No data loss

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-3.3: Confirm & Save Changes**
**Objective:** Validate the confirm and save workflow.

**Task:** "Confirm and save all pending changes you just made."

**Steps:**
1. User has pending changes (from TC-3.2)
2. User reviews pending changes bar
3. User clicks "Confirm & Save Changes" button
4. User observes changes commit
5. User observes highlights disappear

**Success Criteria:**
- ✅ "Confirm & Save Changes" button is visible
- ✅ Changes save successfully
- ✅ Highlights clear after save
- ✅ Pending changes count resets
- ✅ Success feedback is shown (if applicable)

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-3.4: Discard Changes**
**Objective:** Validate discarding pending changes.

**Task:** "Discard all pending changes without saving."

**Steps:**
1. User has pending changes
2. User clicks "Discard Changes" button
3. User confirms (if prompted)
4. User observes changes revert
5. User observes highlights disappear

**Success Criteria:**
- ✅ "Discard Changes" button is visible
- ✅ Changes revert to original values
- ✅ Highlights clear
- ✅ Pending changes count resets
- ✅ No data is saved

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-3.5: Navigation Guard (Unsaved Changes Warning)**
**Objective:** Validate that users are warned when leaving with unsaved changes.

**Task:** "Make some edits, then try to apply a different filter without saving."

**Steps:**
1. User makes edits (creates pending changes)
2. User applies a new filter (or changes search)
3. User observes warning dialog/message
4. User chooses to save or discard
5. User observes appropriate action

**Success Criteria:**
- ✅ Warning appears before navigation
- ✅ Warning message is clear
- ✅ User can choose to save or discard
- ✅ Navigation proceeds after choice
- ✅ No data loss occurs

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-3.6: Keyboard Navigation in Editing**
**Objective:** Validate keyboard shortcuts for editing.

**Task:** "Use keyboard navigation to edit multiple cells: Tab to move between cells, Enter to confirm, Esc to cancel."

**Steps:**
1. User double-clicks a cell to edit
2. User presses Tab to move to next editable cell
3. User presses Enter to confirm a change
4. User presses Esc to cancel an edit
5. User observes correct behavior

**Success Criteria:**
- ✅ Tab moves to next editable cell
- ✅ Enter confirms and moves down (or stays)
- ✅ Esc cancels edit and reverts value
- ✅ Keyboard navigation is smooth

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

### **Test Suite 4: Bulk Operations**

#### **TC-4.1: Copy All Values**
**Objective:** Validate copying all values from a column.

**Task:** "Copy all retail prices from the 'Retail Price' column."

**Steps:**
1. User views results grid
2. User hovers over "Retail Price" column header
3. User clicks the modify options menu (three dots)
4. User clicks "Copy All"
5. User observes confirmation/feedback

**Success Criteria:**
- ✅ Modify options menu is discoverable (appears on hover)
- ✅ "Copy All" option is available
- ✅ Copy operation completes successfully
- ✅ Feedback is provided (if applicable)

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-4.2: Copy Selected Values**
**Objective:** Validate copying values from selected rows only.

**Task:** "Select 3 rows, then copy their retail prices."

**Steps:**
1. User selects 3 rows using checkboxes
2. User hovers over "Retail Price" column header
3. User opens modify options menu
4. User clicks "Copy Selected"
5. User observes confirmation/feedback

**Success Criteria:**
- ✅ Row selection works correctly
- ✅ "Copy Selected" is enabled when rows are selected
- ✅ Only selected row values are copied
- ✅ Feedback is provided

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-4.3: Paste Values**
**Objective:** Validate pasting copied values.

**Task:** "Paste the copied retail prices into the 'Wholesale Price' column."

**Steps:**
1. User has copied values (from TC-4.1 or TC-4.2)
2. User hovers over "Wholesale Price" column header
3. User opens modify options menu
4. User clicks "Paste"
5. User observes values paste correctly

**Success Criteria:**
- ✅ "Paste" option is enabled when values are copied
- ✅ Values paste into correct column
- ✅ Values paste into correct rows (if selected)
- ✅ Pasted values appear as pending changes

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-4.4: Fill All with Value**
**Objective:** Validate filling all cells in a column with a single value.

**Task:** "Fill all items' status to 'Active'."

**Steps:**
1. User hovers over "Status" column header
2. User opens modify options menu
3. User clicks "Fill All"
4. User enters "Active" in dialog
5. User clicks "Apply"
6. User observes all cells update

**Success Criteria:**
- ✅ "Fill All" option is available
- ✅ Dialog opens correctly
- ✅ Value input works
- ✅ All cells update to "Active"
- ✅ Changes appear as pending

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-4.5: Fill Selected with Value**
**Objective:** Validate filling selected cells only.

**Task:** "Select 5 rows, then fill their retail prices with $25.00."

**Steps:**
1. User selects 5 rows
2. User hovers over "Retail Price" column header
3. User opens modify options menu
4. User clicks "Fill Selected"
5. User enters "25.00" in dialog
6. User clicks "Apply"
7. User observes only selected cells update

**Success Criteria:**
- ✅ "Fill Selected" is enabled when rows are selected
- ✅ Only selected cells update
- ✅ Other cells remain unchanged
- ✅ Changes appear as pending

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-4.6: Percentage Off (All)**
**Objective:** Validate percentage discount operation on all values.

**Task:** "Apply a 10% discount to all retail prices."

**Steps:**
1. User hovers over "Retail Price" column header
2. User opens modify options menu
3. User clicks "% Off All"
4. User enters "10" in dialog
5. User clicks "Apply"
6. User observes all prices decrease by 10%

**Success Criteria:**
- ✅ "% Off All" option is available (for numeric columns)
- ✅ Dialog accepts percentage input
- ✅ Calculation is correct (e.g., $30 → $27)
- ✅ All cells update correctly
- ✅ Changes appear as pending

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-4.7: Percentage Increase (Selected)**
**Objective:** Validate percentage increase on selected values.

**Task:** "Select 3 rows and increase their wholesale prices by 15%."

**Steps:**
1. User selects 3 rows
2. User hovers over "Wholesale Price" column header
3. User opens modify options menu
4. User clicks "% Incr. Selected"
5. User enters "15" in dialog
6. User clicks "Apply"
7. User observes only selected prices increase by 15%

**Success Criteria:**
- ✅ "% Incr. Selected" is enabled when rows are selected
- ✅ Calculation is correct (e.g., $20 → $23)
- ✅ Only selected cells update
- ✅ Changes appear as pending

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-4.8: Undo All**
**Objective:** Validate undoing all changes in a column.

**Task:** "Undo all changes made to the 'Status' column."

**Steps:**
1. User has made changes to Status column (from TC-4.4)
2. User hovers over "Status" column header
3. User opens modify options menu
4. User clicks "Undo All"
5. User observes all cells revert to original values

**Success Criteria:**
- ✅ "Undo All" option is available
- ✅ All cells revert correctly
- ✅ Highlights clear
- ✅ Pending changes count updates

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

#### **TC-4.9: Undo Selected**
**Objective:** Validate undoing changes for selected rows only.

**Task:** "Select 2 rows and undo their retail price changes."

**Steps:**
1. User has made changes to multiple rows
2. User selects 2 rows
3. User hovers over "Retail Price" column header
4. User opens modify options menu
5. User clicks "Undo Selected"
6. User observes only selected rows revert

**Success Criteria:**
- ✅ "Undo Selected" is enabled when rows are selected
- ✅ Only selected rows revert
- ✅ Other rows keep their changes
- ✅ Highlights update correctly

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

### **Test Suite 4B: Business Scenarios (Real-World Workflows)**

#### **TC-4B.1: Update Prices for Spring Collection (Business Scenario)**
**Objective:** Validate complete workflow for updating prices for a seasonal collection using filters, bulk operations, and inline editing.

**Task:** "You need to update prices for the Spring 2025 collection. Find all items in Department 'Apparel-01' with Season 'Spring 2025', then apply a 15% price increase to all retail prices, and save the changes."

**Steps:**
1. User opens filter panel
2. User selects Department "Apparel-01" (multi-select)
3. User selects Season "Spring 2025"
4. User applies filters
5. User reviews results (should show Spring 2025 items)
6. User hovers over "Retail Price" column header
7. User opens modify options menu
8. User clicks "% Incr. All"
9. User enters "15" in dialog
10. User clicks "Apply"
11. User observes all retail prices increase by 15%
12. User reviews pending changes
13. User clicks "Confirm & Save Changes"
14. User observes success confirmation

**Success Criteria:**
- ✅ Filters apply correctly to find Spring collection items
- ✅ Bulk percentage operation works on all results
- ✅ Calculation is correct (e.g., $100 → $115)
- ✅ Changes are saved successfully
- ✅ **Time to complete is faster than legacy system** (primary metric)

**Metrics:**
- **Time to complete: ___ seconds** (PRIMARY METRIC - compare to legacy)
- Time to filter: ___ seconds
- Time to apply bulk operation: ___ seconds
- Time to save: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5
- **Time saved vs legacy: ___ seconds** (if baseline available)

---

#### **TC-4B.2: Bulk Edit Vendor Information (Business Scenario)**
**Objective:** Validate complete workflow for bulk editing vendor information using filters, selection, and bulk fill operations.

**Task:** "You need to update vendor information for Vendor 'ABC Company'. Find all items from this vendor, select the first 20 items, change their Status to 'Active', update their Active Code to 'Y', and save the changes."

**Steps:**
1. User opens filter panel
2. User expands "Vendor" section
3. User selects "ABC Company" from vendor dropdown (multi-select)
4. User applies filters
5. User reviews results (should show ABC Company items)
6. User selects first 20 rows using checkboxes
7. User hovers over "Status" column header
8. User opens modify options menu
9. User clicks "Fill Selected"
10. User enters "Active" in dialog
11. User clicks "Apply"
12. User hovers over "Active Code" column header
13. User opens modify options menu
14. User clicks "Fill Selected"
15. User enters "Y" in dialog
16. User clicks "Apply"
17. User reviews pending changes (should show 20 rows × 2 fields = 40 changes)
18. User clicks "Confirm & Save Changes"
19. User observes success confirmation

**Success Criteria:**
- ✅ Vendor filter works correctly
- ✅ Multi-row selection works
- ✅ Bulk fill operations work on selected rows only
- ✅ Multiple bulk operations can be applied sequentially
- ✅ Changes are saved successfully
- ✅ **Time to complete is faster than legacy system** (primary metric)

**Metrics:**
- **Time to complete: ___ seconds** (PRIMARY METRIC - compare to legacy)
- Time to filter: ___ seconds
- Time to select rows: ___ seconds
- Time to apply bulk operations: ___ seconds
- Time to save: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5
- **Time saved vs legacy: ___ seconds** (if baseline available)

---

### **Test Suite 5: Vendor Modes**

#### **TC-5.1: Switch to Secondary Vendor Mode**
**Objective:** Validate switching between Primary and Secondary vendor modes.

**Task:** "Switch to Secondary Vendor mode to edit vendor-specific pricing."

**Steps:**
1. User opens filter panel
2. User expands "Vendor" section
3. User selects "Secondary" radio button
4. User observes mode change
5. User observes info banner (if applicable)
6. User reviews editable fields in results grid

**Success Criteria:**
- ✅ Mode switch is discoverable
- ✅ Mode changes immediately
- ✅ Info banner appears (explaining restrictions)
- ✅ Only price and status fields are editable
- ✅ Other fields are read-only (visual indication)

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-5.2: Edit in Secondary Vendor Mode**
**Objective:** Validate editing restrictions in Secondary mode.

**Task:** "In Secondary Vendor mode, try to edit a retail price and a description field."

**Steps:**
1. User is in Secondary Vendor mode
2. User attempts to edit retail price (should work)
3. User attempts to edit description (should be read-only)
4. User observes behavior

**Success Criteria:**
- ✅ Retail price is editable
- ✅ Description is read-only (no edit cursor, or disabled state)
- ✅ Visual feedback indicates read-only state
- ✅ No errors occur

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-5.3: Switch Back to Primary Mode**
**Objective:** Validate switching back to Primary mode.

**Task:** "Switch back to Primary Vendor mode."

**Steps:**
1. User is in Secondary Vendor mode
2. User opens filter panel
3. User selects "Primary" radio button
4. User observes mode change
5. User reviews editable fields

**Success Criteria:**
- ✅ Mode switches correctly
- ✅ Info banner disappears (if applicable)
- ✅ All previously editable fields become editable again
- ✅ No data loss occurs

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

### **Test Suite 6: Saved Sessions**

#### **TC-6.1: Save Current Search Session**
**Objective:** Validate saving a search configuration.

**Task:** "Save your current search (with filters and sort) as 'Spring Collection 2025'."

**Steps:**
1. User has applied filters and set sort order
2. User clicks "Saved Searches" button (or similar)
3. User clicks "Save Current Search" (or "+ New")
4. User enters "Spring Collection 2025" as name
5. User clicks "Save"
6. User observes session saved

**Success Criteria:**
- ✅ Save dialog opens correctly
- ✅ Name input works
- ✅ Save completes successfully
- ✅ Session appears in list
- ✅ Feedback is provided

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-6.2: Load Saved Session**
**Objective:** Validate loading a previously saved session.

**Task:** "Load the 'Spring Collection 2025' session you just saved."

**Steps:**
1. User clicks "Saved Searches" button
2. User views list of saved sessions
3. User clicks on "Spring Collection 2025"
4. User observes filters and sort restore
5. User observes results load

**Success Criteria:**
- ✅ Saved sessions list displays correctly
- ✅ Session loads successfully
- ✅ All filters restore correctly
- ✅ Sort order restores correctly
- ✅ Results load with correct criteria

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-6.3: Delete Saved Session**
**Objective:** Validate deleting a saved session.

**Task:** "Delete the 'Spring Collection 2025' session."

**Steps:**
1. User opens saved sessions dialog
2. User finds "Spring Collection 2025" in list
3. User clicks delete button (trash icon or similar)
4. User confirms deletion (if prompted)
5. User observes session removed from list

**Success Criteria:**
- ✅ Delete button is discoverable
- ✅ Confirmation dialog appears (if applicable)
- ✅ Session is removed from list
- ✅ No errors occur

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

### **Test Suite 7: Error Handling & Edge Cases**

#### **TC-7.1: Empty Search Results**
**Objective:** Validate behavior when no results are found.

**Task:** "Search for something that doesn't exist (e.g., 'XYZ123NONEXISTENT')."

**Steps:**
1. User enters search term that returns no results
2. User observes empty state message
3. User reviews message clarity

**Success Criteria:**
- ✅ Empty state message is clear
- ✅ Message suggests next steps
- ✅ No errors occur
- ✅ User can easily modify search

**Metrics:**
- Time to understand: ___ seconds
- User satisfaction: ___ / 5

---

#### **TC-7.2: Invalid Input Validation**
**Objective:** Validate input validation (e.g., negative prices, invalid dates).

**Task:** "Try to enter a negative retail price (-$10.00)."

**Steps:**
1. User edits a retail price cell
2. User enters "-10.00"
3. User attempts to save/confirm
4. User observes validation feedback

**Success Criteria:**
- ✅ Validation catches invalid input
- ✅ Error message is clear
- ✅ User cannot save invalid data
- ✅ Visual feedback (red border, tooltip)

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-7.3: Large Dataset Performance (1000+ Items)**
**Objective:** Validate performance with large result sets (addressing large dataset requirement).

**Task:** "Search for a broad term that returns 1000+ results, then scroll through the grid and apply filters."

**Steps:**
1. User performs search returning 1000+ results
2. User observes load time
3. User scrolls through grid (both vertically and horizontally)
4. User applies a filter (e.g., Department)
5. User observes filter application time
6. User scrolls through filtered results

**Success Criteria:**
- ✅ Search completes within 3 seconds for 1000+ items
- ✅ Grid renders smoothly without lag
- ✅ Scrolling is responsive (60 FPS or smooth)
- ✅ Filter application completes within 2 seconds
- ✅ No browser freezing or performance degradation
- ✅ **Performance is acceptable for daily use** (not painful like legacy)

**Metrics:**
- Load time: ___ seconds (target: <3s)
- Filter application time: ___ seconds (target: <2s)
- Scroll FPS: ___ (if measurable, target: 60 FPS)
- User satisfaction with performance: ___ / 5
- Comparison to legacy: "Faster" / "Same" / "Slower"

---

#### **TC-7.4: Browser Refresh with Pending Changes**
**Objective:** Validate behavior when user refreshes browser with unsaved changes.

**Task:** "Make some edits, then refresh the browser page."

**Steps:**
1. User makes edits (creates pending changes)
2. User refreshes browser (F5 or Cmd/Ctrl+R)
3. User observes warning dialog (if applicable)
4. User chooses action
5. User observes result

**Success Criteria:**
- ✅ Warning appears (beforeunload event)
- ✅ User can choose to stay or leave
- ✅ If user stays, changes are preserved (if possible)
- ✅ If user leaves, changes are lost (expected)

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)

---

### **Test Suite 8: Accessibility & Usability**

#### **TC-8.1: Keyboard Navigation**
**Objective:** Validate keyboard-only navigation.

**Task:** "Navigate the entire application using only the keyboard (no mouse)."

**Steps:**
1. User uses Tab to navigate through interface
2. User uses Enter/Space to activate buttons
3. User uses Arrow keys in grids/dropdowns
4. User completes a full workflow (search → filter → edit)

**Success Criteria:**
- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators are visible
- ✅ Tab order is logical
- ✅ User can complete tasks without mouse

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-8.2: Screen Reader Compatibility**
**Objective:** Validate screen reader compatibility (if applicable).

**Task:** "Use a screen reader (VoiceOver/NVDA) to navigate and complete a search task."

**Steps:**
1. User enables screen reader
2. User navigates interface
3. User completes search task
4. User reviews results

**Success Criteria:**
- ✅ All elements have proper ARIA labels
- ✅ Screen reader announces actions correctly
- ✅ User can complete tasks
- ✅ No critical accessibility errors

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

#### **TC-8.3: Mobile/Responsive Layout (if applicable)**
**Objective:** Validate responsive design on smaller screens.

**Task:** "Resize browser to tablet/mobile size and complete a search task."

**Steps:**
1. User resizes browser to 768px width (tablet) or 375px (mobile)
2. User attempts to use filter panel
3. User attempts to view results grid
4. User completes a search task

**Success Criteria:**
- ✅ Layout adapts to screen size
- ✅ Filter panel is usable (collapsible or overlay)
- ✅ Results grid is scrollable/usable
- ✅ No horizontal scrolling required
- ✅ Touch targets are adequate (if touch device)

**Metrics:**
- Time to complete: ___ seconds
- Errors: ___ (count)
- User satisfaction: ___ / 5

---

## 📅 30-Minute Session Plans

### **Session 1: Filter Application & Search Discovery (30 minutes)**
**Focus:** Priority 1 (Filters) + Priority 2 (Search) + Legacy Pain Points

**Test Cases (in order):**
1. **TC-1.1:** Basic Quick Search (3 min)
2. **TC-1.2:** Filter Panel Discovery & Usage (5 min)
3. **TC-1.3:** Multiple Filter Combination (5 min)
4. **TC-2.4:** All Fields Available in Results - **Legacy Pain Point** (5 min)
5. **TC-1.4:** Filter Removal (2 min)
6. **TC-7.3:** Large Dataset Performance (5 min)
7. **Post-Test Questions** (5 min)

**Key Metrics to Track:**
- Time to complete each task (compare to legacy baseline if available)
- Number of errors/assists
- User satisfaction with filter UI (not painful like legacy)
- All 35 fields accessible (addressing legacy pain point)

---

### **Session 2: Bulk Operations & Business Scenarios (30 minutes)**
**Focus:** Priority 1 (Bulk Operations) + Real-World Workflows

**Test Cases (in order):**
1. **TC-4.1:** Copy All Values (2 min)
2. **TC-4.2:** Copy Selected Values (2 min)
3. **TC-4.4:** Fill All with Value (3 min)
4. **TC-4.5:** Fill Selected with Value (3 min)
5. **TC-4.6:** Percentage Off (All) (3 min)
6. **TC-4.7:** Percentage Increase (Selected) (3 min)
7. **TC-4B.1:** Update Prices for Spring Collection - **Business Scenario** (8 min)
8. **TC-4B.2:** Bulk Edit Vendor Information - **Business Scenario** (6 min)

**Key Metrics to Track:**
- **Time to complete business scenarios** (PRIMARY - compare to legacy)
- Time saved vs legacy system
- Number of errors/assists
- User satisfaction with bulk operations

---

### **Session 3: Inline Editing & Complete Workflows (30 minutes)**
**Focus:** Priority 3 (Inline Editing) + End-to-End Workflows

**Test Cases (in order):**
1. **TC-3.1:** Basic Cell Editing (3 min)
2. **TC-3.2:** Multiple Cell Edits (4 min)
3. **TC-3.3:** Confirm & Save Changes (3 min)
4. **TC-3.4:** Discard Changes (2 min)
5. **TC-3.5:** Navigation Guard (3 min)
6. **TC-3.6:** Keyboard Navigation (3 min)
7. **TC-4B.1:** Update Prices for Spring Collection - **Complete Workflow** (8 min)
8. **Post-Test Questions** (4 min)

**Key Metrics to Track:**
- Time to complete editing tasks
- Time to save changes
- Number of errors/assists
- User satisfaction with editing workflow
- Comparison to legacy editing experience

---

## 📊 Test Execution Template

### **Participant Information**
- **Participant ID:** ___
- **Role:** ___ (Merchandising Manager / Buyer / Category Analyst / Vendor Relations Manager)
- **Experience Level:** ___ (Novice / Intermediate / Expert)
- **Date:** ___
- **Session Duration:** ___ minutes
- **Tester/Moderator:** ___

### **Overall Metrics**
- **Total Tasks Completed:** ___ / ___
- **Total Time:** ___ minutes
- **Total Errors:** ___ (Critical: ___, Minor: ___)
- **Error Rate:** ___% (Target: <10%)
- **User Satisfaction (Average):** ___ / 5
- **SUS Score:** ___ / 100

### **Time Savings Analysis (PRIMARY METRIC)**
- **Average Time per Task:** ___ seconds
- **Total Time for Session:** ___ minutes
- **Legacy System Baseline (if available):** ___ minutes
- **Time Saved vs Legacy:** ___ minutes (___% improvement)
- **Fastest Task:** ___ (___ seconds)
- **Slowest Task:** ___ (___ seconds)

### **Legacy Pain Point Assessment**
- **All 35 Fields Available:** ✅ Yes / ❌ No
- **UI Not Painful:** ✅ Yes / ❌ No
- **Fields Missing (if any):** ___ (list)
- **UI Pain Points Identified:** ___ (list)

### **Key Findings**
- **Top 3 Positive Findings:**
  1. ___
  2. ___
  3. ___

- **Top 3 Issues/Concerns:**
  1. ___
  2. ___
  3. ___

- **Recommendations:**
  1. ___
  2. ___
  3. ___

---

## 📝 Notes & Observations Template

For each test case, document:
- **User's verbal comments** (think-aloud protocol)
- **Observed behaviors** (hesitations, confusion, errors)
- **Time taken** for each step
- **Assistance provided** (if any)
- **User's emotional response** (frustration, delight, confusion)

---

## 🎯 Post-Test Questionnaire

### **System Usability Scale (SUS)**
*Rate each statement 1-5 (Strongly Disagree to Strongly Agree):*

1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to be able to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

### **Open-Ended Questions**
1. What did you like most about the application?
2. What did you like least about the application?
3. What would you change if you could?
4. **How does this compare to your current (legacy) system?**
   - Faster / Same / Slower
   - Easier to use / Same / More difficult
   - More fields available / Same / Fewer fields
   - Less painful UI / Same / More painful UI
5. **Time Savings:**
   - How much time do you think this system would save you per task? (estimate in minutes/seconds)
   - Which tasks were noticeably faster than the legacy system?
   - Which tasks took longer or were more difficult?
6. **Field Availability:**
   - Were all the fields you need available in the results table?
   - Did you find any missing fields compared to the legacy system?
   - Was it easier or harder to access the fields you need?
7. **UI Experience:**
   - Was the UI intuitive and easy to use?
   - Was it less "painful" than the legacy system? (Yes/No/About the same)
   - What specific UI elements were helpful or confusing?
8. Would you recommend this to a colleague? Why or why not?

---

## ✅ Next Steps

1. ✅ **Review answers to clarifying questions** (Q1-Q14) - **COMPLETED**
2. ✅ **Customize test cases** based on priorities and user feedback - **COMPLETED**
3. **Prepare test data and scenarios:**
   - Create mock dataset with 1000+ items
   - Include Spring 2025 collection items
   - Include items from "ABC Company" vendor
   - Include various departments, classes, and attributes
   - Include pricing data for percentage operations
4. **Recruit participants:**
   - 5 Merchandising Managers or Buyers
   - Intermediate experience with legacy system
   - Novice with data management tools and web apps
5. **Schedule test sessions:**
   - 3 sessions × 30 minutes each
   - In-person (lab/office) or asynchronous (user records themselves)
   - Hybrid methodology (mix of moderated and unmoderated)
6. **Prepare test environment:**
   - Set up application with large dataset (1000+ items)
   - Prepare screen recording tools (if asynchronous)
   - Prepare time tracking tools
   - Prepare legacy system baseline (if available for comparison)
7. **Conduct tests** and document findings:
   - Track time for each task (PRIMARY METRIC)
   - Document errors and assists
   - Collect user satisfaction scores
   - Note legacy pain point improvements
8. **Analyze results:**
   - Calculate time savings vs legacy (if baseline available)
   - Identify areas for improvement
   - Prioritize fixes based on impact
9. **Iterate** and re-test if needed

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Author:** [Your Name/Team]

