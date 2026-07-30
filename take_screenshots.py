import os
import asyncio
from playwright.async_api import async_playwright

SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), 'screenshots')

if not os.path.exists(SCREENSHOTS_DIR):
    os.makedirs(SCREENSHOTS_DIR)

async def take_screenshot(page, url, filename, full_page=True):
    try:
        print(f"Visiting {url} ...")
        await page.goto(url, wait_until='networkidle')
        await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, filename), full_page=full_page)
        print(f"Saved {filename}")
    except Exception as e:
        print(f"Failed to capture {url}: {e}")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # 1. React App
        await take_screenshot(page, 'http://localhost:5173/', 'react_home.png')
        await take_screenshot(page, 'http://localhost:5173/products', 'react_products.png')
        await take_screenshot(page, 'http://localhost:5173/admin/login', 'react_admin_login.png')
        await take_screenshot(page, 'http://localhost:5173/admin/dashboard', 'react_admin_dashboard.png')

        # 2. Pranayuv static site
        pranayuv_index = 'file:///C:/Users/Aryan/OneDrive/Desktop/Pranayuv/index.html'
        await take_screenshot(page, pranayuv_index, 'pranayuv_index.png')

        # 3. Figma Exports
        figma_dir = 'file:///C:/Users/Aryan/OneDrive/Desktop/Pranayuv/figma/'
        await take_screenshot(page, figma_dir + 'EduNexus-olive-theme.html', 'figma_edunexus.png')
        await take_screenshot(page, figma_dir + 'admission-requirements.html', 'figma_admission_req.png')
        await take_screenshot(page, figma_dir + 'principal-dashboard.html', 'figma_principal_dash.png')
        await take_screenshot(page, figma_dir + 'student-dashboard-v2.html', 'figma_student_dash.png')

        # 4. School Management
        school_dir = 'file:///C:/Users/Aryan/OneDrive/Desktop/Pranayuv/school_management/'
        await take_screenshot(page, school_dir + 'index.html', 'school_index.png')
        await take_screenshot(page, school_dir + 'admission.html', 'school_admission.png')
        await take_screenshot(page, school_dir + 'student-dashboard.html', 'school_student_dash.png')
        await take_screenshot(page, school_dir + 'principal-dashboard.html', 'school_principal_dash.png')
        await take_screenshot(page, school_dir + 'analysis.html', 'school_analysis.png')
        await take_screenshot(page, school_dir + 'registration.html', 'school_registration.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
